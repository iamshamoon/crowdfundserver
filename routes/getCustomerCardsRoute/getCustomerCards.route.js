const express = require("express");
const router = express.Router();
const httpGetCustomerCardsHandler = require("../../controller/getCustomerCardsController/getCustomerCards.controller");

router.get("/:customerId", httpGetCustomerCardsHandler);

module.exports = router;
