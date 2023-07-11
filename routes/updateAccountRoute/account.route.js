const express = require("express");
const router = express.Router();

const httpGetCardHandler = require("../../controller/getAccountCardController/getAccountCard.controller");
const httpPostUpdateCardHandler = require("../../controller/updateAccountCardController/updateAccountCard.controller");
const httpPostCreateCardHandler = require("../../controller/createAccountCardController/createAccountCard.controller");
router.post("/", httpPostUpdateCardHandler);
router.post("/get", httpGetCardHandler);
router.post("/create", httpPostCreateCardHandler);

module.exports = router;
