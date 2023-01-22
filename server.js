const express = require("express");
const path = require('path');
const app = express();
const db = require("./app/db");
const config = require("./config.json");

// parse requests of content-type - application/json
app.use(express.json({
  limit: '1mb'
}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
  limit: '1mb',
}));

app.use(express.static(path.resolve("app/www")));

db.mongoose.connect(db.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.info("Connected to the MongoDb database!");
  })
  .catch(err => {
    console.error("Cannot connect to the MongoDb database!", err);
    process.exit();
  });

require("./app/routes")(app);

// set port, listen for requests
const PORT = config.app.port;
app.listen(PORT, function () {
  console.info(`App listening at ${PORT}`);
});

// ========== process error handling [ start ] ==========
process.on('uncaughtException', err => {
  console.error("'uncaughtException' occurred! \n error:", err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', reason.stack || reason);
});
// ========== process error handling [ end ] ==========