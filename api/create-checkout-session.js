const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const YOUR_DOMAIN = process.env.DOMAIN || 'http://localhost:3000';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: YOUR_DOMAIN + '/return.html?session_id={CHECKOUT_SESSION_ID}',
    });

    res.status(200).json({ clientSecret: session.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
