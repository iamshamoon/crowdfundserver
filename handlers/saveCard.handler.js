const { stripe } = require("../setting/setting");
const axios = require("axios");
module.exports = async function saveCard(token, customerId) {
  try {
    const card = await stripe.customers.createSource(customerId, {
      source: token,
    });
    console.log("Credit card saved successfully:", card.id);

    // const response = await axios.post("/save-card", {
    //   cardId: card.id,
    //   customerId: customerId
    // });
    console.log("Credit card information saved on the server:", response.data);
  } catch (error) {
    console.error("Error saving credit card:", error);
  }
};
