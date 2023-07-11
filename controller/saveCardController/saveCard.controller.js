const saveCard = require("../../handlers/saveCard.handler");
const httpPostSaveCardHandler = async (req, res) => {
  const { token, customerId } = req.body;
  await saveCard(token, customerId);
  res.send({ message: "Credit card saved successfully" });
};
module.exports = httpPostSaveCardHandler;
