require("dotenv").config();
const stripe = require("stripe")(
  "sk_test_51MsXpnIepevlqjUwR7WDZNs3XjwY9Qu1xtUjZsXtQmrPdkNUqMuhXhoY4sPmcB0mhBLNw43K6IiZWHEezUcYFta400dkR1z9cb"
);
module.exports = { stripe };
