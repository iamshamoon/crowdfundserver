const express = require("express");
const router = express.Router();
const httpPostCreateCustomerHandler = require("../../controller/createCustomerController/createCustomer.controller");
router.post("/", httpPostCreateCustomerHandler);
module.exports = router;
