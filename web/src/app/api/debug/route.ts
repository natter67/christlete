import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase-admin';

export async function GET() {
  const results: Record<string, string> = {};

  results.stripeKey = process.env.STRIPE_SECRET_KEY
    ? 'set (' + process.env.STRIPE_SECRET_KEY.slice(0, 12) + '...)'
    : 'MISSING';
  results.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'MISSING';
  results.serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'MISSING';

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });
    const price = await stripe.prices.retrieve('price_1TCU3PCLTY8eK351LChcShy7');
    results.stripe = 'ok - ' + price.id;
  } catch (e) {
    results.stripe = 'ERROR: ' + String(e);
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.from('subscriptions').select('id').limit(1);
    results.supabase = error ? 'ERROR: ' + error.message : 'ok';
  } catch (e) {
    results.supabase = 'ERROR: ' + String(e);
  }

  return NextResponse.json(results);
}
