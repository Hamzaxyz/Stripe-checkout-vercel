// This is your test publishable API key.
const stripe = Stripe("pk_test_51T4kLx2Uy4uhkV7rphGEd8N1xaEp76JnPWEnT4xwXoIzMv5Zy2FVi7l0hZWavw9fIZRqaes8XtHmcWPI0CbDkvpz00FHdM1sE0");

initialize();

// Create a Checkout Session
async function initialize() {
  const fetchClientSecret = async () => {
    const response = await fetch("/create-checkout-session", {
      method: "POST",
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  const checkout = await stripe.initEmbeddedCheckout({
    fetchClientSecret,
  });

  // Mount Checkout
  checkout.mount('#checkout');
}