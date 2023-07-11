const { stripe } = require("../../setting/setting");
module.exports = async (req, res) => {
  const { customerId, cardNumber, cardExpiry, cardCVC } = req.body;

  try {
    const cardToken = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: cardExpiry.split("/")[0],
        exp_year: cardExpiry.split("/")[1],
        cvc: cardCVC,
      },
    });

    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: { token: cardToken.id },
    });
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customerId,
    });

    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });

    res.status(200).json({ cardId: paymentMethod.id });
  } catch (error) {
    console.error("Error saving card:", error);
    res.status(500).send("Error saving card");
  }
};
