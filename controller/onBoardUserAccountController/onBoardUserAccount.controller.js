const { stripe } = require("../../setting/setting");
const generateAccountLink = require("../../handlers/generateAccountLink");
const httpPostOnBoardAccount = async (req, res) => {
  try {
    const account = await stripe.accounts.create({ type: "express" });
    req.session.accountID = account.id;
    req.session.uID = req.body.uid;

    const origin = "http://localhost:8000/api";
    console.log("iwashere " + origin);

    const accountLinkURL = await generateAccountLink(
      account.id,
      origin,
      req.body.uid
    );
    res.send({ url: accountLinkURL });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
};
module.exports = httpPostOnBoardAccount;
