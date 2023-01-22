const config = require("../../config.json");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = config.db.url;
db.wallet = require("./wallet")(mongoose);
db.transactions = require("./transactions")(mongoose);
db.products = require("./products")(mongoose);

module.exports = db;
