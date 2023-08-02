const monggose =require('mongoose')



const trains = new monggose.Schema({
    trainName:{
        type:String
    },
    trainNumber:{
        type:String
    }
})
T = monggose.model('traindetails',trains)
module.exports = T