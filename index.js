const expres = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const crypto = require('crypto-js')
const jwt = require('jsonwebtoken')
const users = require('./schema/register')
const T = require('./schema/trains')
const uri = 'mongodb+srv://<username>:<pasword>@cluster0.tas8v.mongodb.net/trainapp?retryWrites=true&w=majority'

var app = expres()
app.use(expres.json())
app.use(cors())


mongoose.connect(uri).then(()=>console.log("Dtabase conected")).catch(err=>console.log(err))
const hash = (message)=>{
    var hc = crypto.SHA512(message)
    return hc.toString(crypto.enc.Base64)
}
app.post('/trian/register',async(req,res)=>{
    try{
        var {companyName,ownerName,rollNo,ownerEmail,accessCode} = req.body;
        accessCode=hash(accessCode);
        var exist = await users.findOne({ownerEmail})
        if(exist){
            return res.status(200).json({ack:'User already exist'})
        }
        var newUser = new users({companyName,ownerName,rollNo,ownerEmail,accessCode})
        newUser.save()
        return res.status(200).json({ack:"User Registerd..."})

    }
    catch(err){
        console.log(err)
        return res.status(500).json({ack:"Inernal Server error"})
    }
})

app.post('/train/auth',async(req,res)=>{
   try{
    var {ownerEmail,accessCode} = req.body;
    var user = await users.findOne({ownerEmail})
    if(!user){
        return res.status(200).json({ack:"User not found in our records"})
    }
    accessCode=hash(accessCode)
    if(!user.accessCode===accessCode){
        return res.status(200).json({ack:"Wrong credintials"})
    }
    
    jwt.sign({i:{mail:user.ownerEmail}},"JwtSecreatCode@123",{expiresIn:"1d"},(err,token)=>{
        if(err){
            return console.log(err)
        }
        else{
            return res.status(200).json({"token-type":"Bearer","access-token":token,status:true})
        }
    })

   }
   catch(err){
    console.log(err)
    return res.status(500).json({ack:"Internal server error"})
   }
    
})

app.get('/trains',async(req,res)=>{
    try{
        var trans = await T.find({})
        return res.status(200).json(trans)

    }
    catch(err){
        console.log(err)
        return res.status(500).json({ack:"Internal server error"})
       }
})



app.listen(5000,()=>{
    console.log("server running...")
})