import React, { useState, useRef } from "react";
import QRCode from "qrcode.react";
import { Link } from "react-router-dom";
import axios from "axios";
import backend_ref from "./Backend_ref";

const GenQR = () => {
  const inputRef = useRef(null); // Create a reference for the form element

  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });
  const [showQR, setShowQR] = useState(false);

  const handleInput = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenQR = async (e) => {
    e.preventDefault();

    try {
      const requestBody = {
        name: userData?.name,
        email: userData?.email,
        scanned: false,
      };
      const response = await axios.post(
        `${backend_ref}/user/generate`,
        requestBody
      );
      setShowQR(true);
      console.log(response.data);
    } catch (error) {
      console.log(error.response.data.error);
    }
  };

  return (
    <div>
      <Link to="/scan-qr">Scan QR</Link>
      <form onSubmit={handleGenQR}>
        <div>
          <input
            type="text"
            onChange={handleInput}
            required
            placeholder="enter name"
            name="name"
            ref={inputRef} // Assign the input element to the reference
          />
        </div>
        <div>
          <input
            type="email"
            onChange={handleInput}
            required
            placeholder="enter email"
            name="email"
          />
        </div>
        <input type="submit" required value="Generate QR" />
      </form>
      {showQR && (
        <QRCode
          value={JSON.stringify(userData)}
          size={200}
          style={{ margin: "20px" }}
        />
      )}
    </div>
  );
};

export default GenQR;
