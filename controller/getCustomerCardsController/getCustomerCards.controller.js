const { stripe } = require("../../setting/setting");
const httpGetCustomerCardsHandler = async (req, res) => {
  try {
    const customer = await stripe.customers.retrieve(req.params.customerId);
    const cards = await stripe.customers.listSources(customer.id, {
      object: "card",
    });
    console.log("Cards retrieved successfully:", cards.data);
    res.send({ message: "Cards retrieved successfully", cards: cards.data });
  } catch (error) {
    console.error("Error retrieving cards:", error);
    res.status(500).send({ message: "Error retrieving cards" });
  }
};
module.exports = httpGetCustomerCardsHandler;
