const { stripe } = require("../../setting/setting");
const httpGetCustomerHandler = async (req, res) => {
  try {
    const customer = await stripe.customers.retrieve(req.params.customerId);
    console.log("Customer retrieved successfully:", customer.id);
    res.send({ message: "Customer retrieved successfully", customer });
  } catch (error) {
    console.error("Error retrieving customer:", error);
    res.status(500).send({ message: "Error retrieving customer" });
  }
};
module.exports = httpGetCustomerHandler;
