const express = require("express");
const router = express.Router();
const httpPostCreateChargeHandler = require("../../controller/createChargeController/createCharge.controller");
router.post("/", httpPostCreateChargeHandler);
module.exports = router;
