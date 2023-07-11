const { stripe } = require("../../setting/setting");
const httpPostCreateChargeHandler = async (req, res) => {
  const { customerId, amount } = req.body;
  console.log(customerId);
  const customer = await stripe.customers.retrieve(customerId);
  const defaultPaymentMethod = customer.invoice_settings.default_payment_method;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount) * 100, // amount in cents
      currency: "usd",
      customer: customerId,
      payment_method: defaultPaymentMethod, // this will use the customer's default payment method
      off_session: true,
      confirm: true,
    });

    if (paymentIntent.status === "succeeded") {
      console.log("Payment was successful");
      res.send({ message: "success" });
    } else {
      console.log("Payment failed");
      res.status(500).send({ message: "error" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "error", error: err });
  }
};
module.exports = httpPostCreateChargeHandler;
