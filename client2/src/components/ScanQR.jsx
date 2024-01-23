import axios from "axios";
import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import backend_ref from "./Backend_ref";
import "./ScanQR.css";
const ScanQR = () => {
  const [QrDresult, setQrDresult] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [buttonLoader, setButtonLoader] = useState(false);

  const handleResult = async (data) => {
    if (data && scanning) {
      try {
        const requestBody = {
          email: JSON.parse(data.text).email,
        };
        const response = await axios.post(
          `${backend_ref}/user/show/data`,
          requestBody
        );
        setQrDresult(response.data);
        setScanning(false);
      } catch (error) {
        console.log(error.response.data.error);
      }
    }
  };

  const handleScanned = async () => {
    setButtonLoader(true);
    try {
      const requestBody = {
        email: QrDresult?.user?.email,
      };
      await axios.post(`${backend_ref}/user/scanned/success`, requestBody);
      window.location.reload();
      setButtonLoader(false);
    } catch (error) {
      console.log(error.response.data.error);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  // console.log(QrDresult?.user?.scanned);
  // if(QrDresult?.user?.scanned === true)
  // console.log("fura");
  return (
    <div>
      {scanning ? (
        <QrReader
          delay={100}
          onError={handleError}
          onResult={handleResult}
          constraints={{
            facingMode: "environment",
          }}
        />
      ) : (
        <div className="user-data-container">
          <div className="data-container">

          <h3>User Data</h3>
          <p>
            {" "}
            <span>Name</span> : {QrDresult.user && QrDresult.user.name}
          </p>
          <p>
            {" "}
            <span>Email</span> : {QrDresult.user && QrDresult.user.email}
          </p>
          <p style={{ color: QrDresult.user.scanned ? "green" : "red" }}>
            <span>Scanned</span> : 
            {QrDresult.user.scanned ? <> Already Scanned</> : <> False</>}
          </p>

          {QrDresult.user.scanned ? (
            <></>
          ) : !buttonLoader ? (
            <button onClick={handleScanned}>Scan now</button>
          ) : (
            <button>Loading...</button>
          )}
        </div>
        </div>

      )}
    </div>
  );
};

export default ScanQR;
