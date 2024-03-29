const mongoose = require("mongoose");

const connect = () => {
    mongoose.connect("mongodb://localhost:27017/saif42")
    .then((data) => {
        console.log(`MongoDB connected to the server : ${ data.connection.host }`);
    })
    .catch((error) => {
        console.log(error);
    })
}

module.exports = connect;