const express = require("express");
const router = express.Router();
const httpPostSaveCardHandler = require("../../controller/saveCardController/saveCard.controller");

router.post("/", httpPostSaveCardHandler);

module.exports = router;
