const express = require("express");
const router = express.Router();
// const cookieParser = require("cookie-parser");
// const app = express();

const multer = require("multer");
const csv = require("csvtojson");

const QRCode = require("qrcode");
const nodemailer = require("nodemailer");
// app.use(cookieParser());

const User = require("../model/userSchema");
require("../database/connection");

router.post("/user/generate", async (req, res) => {
  const { name, email, scanned } = req.body;
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already exist" });
    }
    const user = new User({
      name: name,
      email: email,
      scanned: scanned,
    });
    await user.save();
    let finalData = {
      user: {
        name: user?.name,
        email: user?.email,
        scanned: user?.scanned,
      },
    };
    return res.status(201).json(finalData);
  } catch (error) {
    return res.status(401).json("Generate Qr Error");
  }
});
router.get('/furkan',(req,res)=>{
  res.send("how are you")
})
router.post("/user/show/data", async (req, res) => {
  const { email } = req.body;
  try {
    const userExist = await User.findOne({ email: email });
    if (!userExist) {
      return res.status(422).json({ error: "Email not exist" });
    }
    let finalData = {
      user: {
        name: userExist?.name,
        email: userExist?.email,
        scanned: userExist?.scanned,
      },
    };
    return res.status(201).json(finalData);
  } catch (error) {
    return res.status(401).json("Scanned Qr Error");
  }
});
router.post("/user/scanned/success", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(422).json({ error: "User not found" });
    }

    // Update the 'scanned' attribute to true
    user.scanned = true;
    await user.save();

    let finalData = {
      user: {
        name: user.name,
        email: user.email,
        scanned: user.scanned,
      },
    };
    return res.status(200).json(finalData);
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
});













// store data csv to mongodb

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage,
});
const fs = require("fs");

router.post("/upload", upload.single("csvFile"), async (req, res) => {
  try {
    // Convert CSV to JSON
    const jsonArray = await csv().fromFile(req.file.path);

    // Insert JSON data into MongoDB
    await User.insertMany(jsonArray);

    // Send success response
    res.json("Data added successfully");
  } catch (error) {
    // Handle errors
    console.error("Error uploading CSV:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Remove the temporary file after processing
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
  }
});

// generate qr code and send to the mail

router.get("/generateQR", async (req, res) => {
  try {
    const users = await User.find();
    const qrCodeImages = [];
    for (const user of users) {
      const { name, email, registration, scanned, center } = user;
      const userData = {
        name: name,
        email: email,
        registration: registration,
        center: center,
        // scanned: scanned,
      };
      const qrCodeDataURI = await QRCode.toDataURL(JSON.stringify(userData));
      // res.send(Buffer.from(qrCodeDataURI.split(";base64,").pop(), "base64"));
      qrCodeImages.push(
        Buffer.from(qrCodeDataURI.split(";base64,").pop(), "base64")
      );
      await sendEmailWithQR(email, qrCodeDataURI);
    }
    res.setHeader("Content-Type", "image/png");

    qrCodeImages.forEach((image) => res.write(image));

    // End the response
    res.end();
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  async function sendEmailWithQR(email, qrCodeDataURI) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "convocation176@gmail.com", // replace with your Gmail email address
          pass: "qeqh skkh wgqk pble",
        },
      });

      const mailOptions = {
        from: "convocation176@gmail.com", // replace with your Gmail email address
        to: email,
        subject: "QR Code Attachment",
        text: "Attached is your QR code.",
        attachments: [
          {
            filename: "qrcode.png",
            content: Buffer.from(
              qrCodeDataURI.split(";base64,").pop(),
              "base64"
            ),
            encoding: "base64",
          },
        ],
      };

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent Successfully", info.response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
});

module.exports = router;
