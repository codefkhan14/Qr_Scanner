const express = require("express");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const axios = require("axios");
dotenv.config();
app.use(cors());
app.use(express.json());
require("./database/connection");
require("./model/userSchema");
app.use(require("./router/auth"));

function pingLink() {
    const linkToPing = "https://qr-scanner-n432.onrender.com/furkan"; // Replace with the link you want to ping
    let data = axios.get(linkToPing);
    data.then((res) => {}); 
}

// Ping the link every 11 minutes (10 minutes = 600,000 milliseconds)
const pingInterval = 11 * 60 * 1000;
setInterval(pingLink, pingInterval);
app.listen(process.env.PORT || 8000);
