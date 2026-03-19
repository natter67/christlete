import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
  });

  let priceId: unknown;
  try {
    ({ priceId } = await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (typeof priceId !== 'string' || !priceId) {
    return NextResponse.json({ error: 'Invalid price selection' }, { status: 400 });
  }

  // Build allowlist from server-side env vars (never exposed to browser)
  const allowedPriceIds = [
    process.env.STRIPE_PRICE_MONTHLY,
    process.env.STRIPE_PRICE_YEARLY,
  ].filter(Boolean) as string[];

  // Require at least one env var to be set — reject everything if unconfigured
  if (allowedPriceIds.length === 0) {
    return NextResponse.json({ error: 'Pricing not configured' }, { status: 503 });
  }

  if (!allowedPriceIds.includes(priceId)) {
    return NextResponse.json({ error: 'Invalid price selection' }, { status: 400 });
  }

  try {

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createAdminClient();

    // Look up existing subscription row
    const { data: sub } = await admin
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    let customerId = sub?.stripe_customer_id;

    if (!customerId) {
      // Get user name from profiles
      const { data: profile } = await admin
        .from('profiles')
        .select('name')
        .eq('user_id', user.id)
        .maybeSingle();

      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.name ?? undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      // Upsert the subscriptions row with the new customer ID
      await admin.from('subscriptions').upsert({
        user_id: user.id,
        stripe_customer_id: customerId,
        plan: 'free',
      }, { onConflict: 'user_id' });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://christlete.love';

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 7,
        metadata: { supabase_user_id: user.id },
      },
      success_url: `${appUrl}/dashboard?upgraded=1`,
      cancel_url: `${appUrl}/upgrade`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    // Log full error server-side but never expose internal details to client
    console.error('Stripe checkout error:', err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: 'Checkout failed. Please try again.' }, { status: 500 });
  }
}
