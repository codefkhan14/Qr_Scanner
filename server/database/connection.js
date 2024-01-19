const mongoose = require("mongoose");
const DB = process.env.DB_NAME;
mongoose
  .connect(DB, {
  })
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log("database connection", err));
  