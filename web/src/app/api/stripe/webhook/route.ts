import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const admin = createAdminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== 'subscription') break;

      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;
      const userId = session.subscription_data?.metadata?.supabase_user_id
        ?? (session as { metadata?: Record<string, string> }).metadata?.supabase_user_id;

      if (!userId) break;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const periodEnd = new Date(subscription.current_period_end * 1000).toISOString();

      await admin.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        plan: 'elite',
        status: subscription.status,
        current_period_end: periodEnd,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.supabase_user_id;
      if (!userId) break;

      const isActive = ['active', 'trialing'].includes(subscription.status);
      const periodEnd = new Date(subscription.current_period_end * 1000).toISOString();

      await admin.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: subscription.customer as string,
        stripe_subscription_id: subscription.id,
        plan: isActive ? 'elite' : 'free',
        status: subscription.status,
        current_period_end: periodEnd,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.supabase_user_id;
      if (!userId) break;

      await admin.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: subscription.customer as string,
        stripe_subscription_id: subscription.id,
        plan: 'free',
        status: 'canceled',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      break;
    }
  }

  return NextResponse.json({ received: true });
}
