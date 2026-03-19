import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase-admin';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Stripe webhook not configured — missing env vars');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
  });
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const admin = createAdminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== 'subscription') break;

      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (!subscriptionId) {
        console.error('checkout.session.completed: missing subscriptionId', { sessionId: session.id });
        break;
      }

      // Prefer customer-level metadata; fall back to session metadata as a safety net
      const customer = await stripe.customers.retrieve(customerId);
      const userId =
        (!customer.deleted ? customer.metadata?.supabase_user_id : undefined) ??
        session.metadata?.supabase_user_id;

      if (!userId) {
        console.error('checkout.session.completed: no supabase_user_id found on customer or session', { customerId, sessionId: session.id });
        break;
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const periodEnd = new Date(subscription.current_period_end * 1000).toISOString();

      const { error: upsertError } = await admin.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        plan: 'elite',
        status: subscription.status,
        current_period_end: periodEnd,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      if (upsertError) {
        console.error('checkout.session.completed: DB upsert failed', upsertError.message);
        return NextResponse.json({ error: 'DB write failed' }, { status: 500 });
      }

      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.supabase_user_id;
      if (!userId) {
        console.error('customer.subscription.updated: no supabase_user_id in subscription metadata', { subscriptionId: subscription.id });
        break;
      }

      const isActive = ['active', 'trialing'].includes(subscription.status);
      const periodEnd = new Date(subscription.current_period_end * 1000).toISOString();

      const { error: upsertError } = await admin.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: subscription.customer as string,
        stripe_subscription_id: subscription.id,
        plan: isActive ? 'elite' : 'free',
        status: subscription.status,
        current_period_end: periodEnd,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      if (upsertError) {
        console.error('customer.subscription.updated: DB upsert failed', upsertError.message);
        return NextResponse.json({ error: 'DB write failed' }, { status: 500 });
      }

      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.supabase_user_id;
      if (!userId) {
        console.error('customer.subscription.deleted: no supabase_user_id in subscription metadata', { subscriptionId: subscription.id });
        break;
      }

      const { error: upsertError } = await admin.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: subscription.customer as string,
        stripe_subscription_id: subscription.id,
        plan: 'free',
        status: 'canceled',
        current_period_end: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      if (upsertError) {
        console.error('customer.subscription.deleted: DB upsert failed', upsertError.message);
        return NextResponse.json({ error: 'DB write failed' }, { status: 500 });
      }

      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = invoice.subscription as string | null;
      if (!subscriptionId) break;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const userId = subscription.metadata?.supabase_user_id;

      if (!userId) {
        console.error('invoice.payment_failed: no supabase_user_id in subscription metadata', { subscriptionId });
        break;
      }

      const { error: upsertError } = await admin.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: subscription.customer as string,
        stripe_subscription_id: subscriptionId,
        plan: 'free',
        status: subscription.status,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      if (upsertError) {
        console.error('invoice.payment_failed: DB upsert failed', upsertError.message);
        return NextResponse.json({ error: 'DB write failed' }, { status: 500 });
      }

      break;
    }
  }

  return NextResponse.json({ received: true });
}
