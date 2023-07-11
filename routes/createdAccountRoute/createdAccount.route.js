const express = require("express");
const mysql = require("mysql");
const { stripe, db } = require("../../setting/setting");

// {connectAccountCard:"asdasd",
// connectAccountId:"asdaskjd"}

const router = express.Router();
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crowdfunding",
});

router.post("/", async (req, res) => {
  const { accId, uid } = req.body;
  if (accId && uid) {
    console.log(accId, uid);
    try {
      const account = await stripe.accounts.retrieve(accId);
      const cards = await stripe.accounts.listExternalAccounts(account.id, {
        object: "card",
        limit: 1,
      });
      const query = `UPDATE users SET account_id = ?, card_id = ? WHERE id = ?`;

      try {
        connection.query(
          query,
          [account.id, cards.data[0].id, uid],
          (err, result) => {
            if (err) return res.status(500).send(err);
          }
        );
      } catch (e) {
        res.status(400).json({ error: "Session Expired. Try again!" });
      }
    } catch (e) {
      res.status(400).json({ error: "Invalid accountID" });
    }
  } else {
    res.status(400).json({ error: "Error" });
  }
});
module.exports = router;
