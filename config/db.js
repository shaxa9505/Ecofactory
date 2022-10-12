const mongoose = require("mongoose");
module.exports = () => {
    // mongoose.connect(process.env.MONGODB_URI);
    // const db = mongoose.connection;
    // db.on("open", () => console.log("Database MongoDb ga  ulandik !!!!"))
    // db.on("error", (err) => {
    //     console.log("Dateabsega ulanishda xatolik yani xatolik => ", err);
    // })
    
    mongoose.connect(process.env.MONGODB_URI) 
    .then(() => console.log("Database MongoDb ga ulandik !!!"));
    mongoose.connection.on('error',function(err){   
    console.log("The error is: ", err);
    })
}