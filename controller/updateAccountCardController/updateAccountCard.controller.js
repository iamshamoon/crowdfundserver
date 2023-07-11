const { stripe } = require("../../setting/setting");
async function httpPostUpdateCardHandler(req, res) {
  const { accountId, cardId, card } = req.body;

  /*
  request 
  aacountID:"",
  cardId:"",
  card:{
    number:"",
    expiryMonth:"",
    expiryYear:"",
    cvc:""
  }
  */
  try {
    await stripe.accounts.deleteExternalAccount(accountId, cardId);
    try {
      const token = stripe.tokens.create({
        card: {
          number: card.number ?? "4000056655665556",
          exp_month: card.expiryMonth ?? 2,
          exp_year: card.expiryYear ?? 2024,
          cvc: card.cvc ?? "314",
          currency: "usd",
        },
      });
      try {
        stripe.accounts.createExternalAccount(accountId, {
          external_account: token.id,
        });
      } catch (e) {
        res.status(400).json({
          e: "Couldn't update card!",
          acctualErr: e,
        });
      }
    } catch (e) {
      res.status(400).json({
        e: "Couldn't update card!",
        acctualErr: e,
      });
    }
  } catch (e) {
    res.status(400).json({
      e: "Couldn't update card!",
      acctualErr: e,
    });
  }
}
module.exports = httpPostUpdateCardHandler;
