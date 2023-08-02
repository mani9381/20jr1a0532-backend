const mongoose = require('mongoose')


const users = new mongoose.Schema({
    companyName:{
        type:String,
    
    },
    ownerName:{
        type:String,
    },
    rollNo:{
        type:String,
    
    },
    ownerEmail:{
        type:String,
        
    },
    accessCode:{
        type:String,

    }
})

const data=mongoose.model('trainusers',users)
module.exports = data