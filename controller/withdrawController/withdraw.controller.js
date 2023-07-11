const { stripe } = require("../../setting/setting");

const httpPostWithdrawal = async (req, res) => {
  const { accountId, amount } = req.body;
  try {
    const balance = await stripe.balance.retrieve();
    console.log(balance);

    const transfer = await stripe.transfers.create({
      amount: amount,
      currency: "usd",
      destination: accountId,
    });
    console.log("here");
    res.send({
      accountId: accountId,
      message: "Withdrawal to card created successfully",
      transfer,
    });
  } catch (error) {
    // if (
    //   error.includes(
    //     "Your destination account needs to have at least one of the following capabilities enabled:"
    //   )
    // ) {
    //   res.status(401).json({
    //     accountId: accountId,
    //     error: "Account needs additional verification!",
    //   });
    // } else {
    //   res.status(500).send({
    //     accountId: accountId,
    //     error: "Error creating withdrawal to card",
    //     actualErr: error.message,
    //   });
    // }
    res.status(500).send({
      accountId: accountId,
      error: "Error creating withdrawal to card",
      actualErr: error.message,
    });
  }
};

module.exports = httpPostWithdrawal;
