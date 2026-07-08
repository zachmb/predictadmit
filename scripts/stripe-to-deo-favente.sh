#!/usr/bin/env bash
# Swap predictadmit's Stripe to the Deo Favente Corp account.
# predictadmit's checkout uses inline price_data, so only the two account keys
# need to change — no product/price/webhook to pre-create.
#
# Run from the predictadmit dir:
#   STRIPE_KEY=sk_live_51Tmjk5... PUB_KEY=pk_live_51Tmjk5... bash scripts/stripe-to-deo-favente.sh
set -euo pipefail
: "${STRIPE_KEY:?set STRIPE_KEY to the Deo Favente Stripe SECRET key (sk_live_...)}"
: "${PUB_KEY:?set PUB_KEY to the Deo Favente Stripe PUBLISHABLE key (pk_live_...)}"

# sanity: confirm the secret key is valid + which account it belongs to
acct=$(curl -s https://api.stripe.com/v1/account -u "$STRIPE_KEY:" \
  | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('id','?'),d.get('business_profile',{}).get('name') or d.get('email',''))")
echo "Stripe account: $acct"

printf '%s' "$STRIPE_KEY" | npx vercel env add STRIPE_SECRET_KEY production --scope deo-favente-corp --force
printf '%s' "$PUB_KEY"    | npx vercel env add PUBLIC_STRIPE_PUBLISHABLE_KEY production --scope deo-favente-corp --force
echo "Keys set. Redeploying..."
npx vercel --prod --yes --scope deo-favente-corp
echo "Done — predictadmit checkout now runs on the Deo Favente Stripe account."
