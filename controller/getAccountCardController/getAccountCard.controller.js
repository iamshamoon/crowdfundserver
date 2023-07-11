const {stripe} =require("../../setting/setting")
const httpGetCardHandler = async (req,res)=>{
    const {accId,cardId}= req.body;
    try{
        const card = await stripe.accounts.retrieveExternalAccount(
            accId,
            cardId
          );
          res.status(200).json({card:card});
        }
        catch(e){
            res.status(404).json({error:"Card not found!",actualErr:e});
            
    }
}
module.exports =httpGetCardHandler;