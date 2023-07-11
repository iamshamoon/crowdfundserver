const generateAccountLink = require("../../handlers/generateAccountLink");
const httpGetOnBoardAccountRefresh = async (req, res) => {
  if (!req.session.accountID) {
    res.redirect("http://localhost:8080");
    return;
  }
  try {
    const { accountID, uID } = req.session;
    const origin = "https://api.lulux.store/api";
    console.log("iwasnthere" + origin);
    const accountLinkURL = await generateAccountLink(accountID, origin, uID);
    res.redirect(accountLinkURL);
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
};
module.exports = httpGetOnBoardAccountRefresh;
