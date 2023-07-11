const { stripe } = require("../../setting/setting");
const httpCreateCustomerHandler = async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      email: req.body.email,
      name: req.body.name,
      description: req.body.description,
    });
    console.log("Customer created successfully:", customer.id);
    res.send({
      message: "Customer created successfully",
      customerId: customer.id,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).send({ message: "Error creating customer" });
  }
};
module.exports = httpCreateCustomerHandler;
