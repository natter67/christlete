import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json();
    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });
    }

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
      .single();

    let customerId = sub?.stripe_customer_id;

    if (!customerId) {
      // Get user name from profiles
      const { data: profile } = await admin
        .from('profiles')
        .select('name')
        .eq('user_id', user.id)
        .single();

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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://christlete.vercel.app';

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
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
