const express = require("express");
const router = express.Router();
const httpPostOnBoardAccount = require("../../controller/onBoardUserAccountController/onBoardUserAccount.controller");
const httpGetOnBoardAccountRefresh = require("../../controller/onBoardUserAccountRefreshController/onBoardUserAccountRefresh.controller");
router.post("/", httpPostOnBoardAccount);
router.get("/refresh", httpGetOnBoardAccountRefresh);
module.exports = router;
