const express = require("express");
const httpPostWithdrawal = require("../../controller/withdrawController/withdraw.controller");
const router = express.Router();

router.post("/", httpPostWithdrawal);
module.exports = router;
