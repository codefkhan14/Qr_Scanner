import axios from "axios";
import React, { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import backend_ref from "./Backend_ref";

const ScanQR = () => {
  const [QrDresult, setQrDresult] = useState(null);
  const [scanning, setScanning] = useState(true);

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
    try {
      const requestBody = {
        email: QrDresult?.user?.email,
      };
      const response = await axios.post(
        `${backend_ref}/user/scanned/success`,
        requestBody
      );
      window.location.reload();
    } catch (error) {
      console.log(error.response.data.error);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  return (
    <div>
      {scanning ? (
        <QrReader
          delay={100}
          style={previewStyle}
          onError={handleError}
          onResult={handleResult}
          constraints={{
            facingMode: "environment",
          }}
        />
      ) : (
        <>
          <h3>User Data</h3>
          {QrDresult && (
            <>
              <p>Name: {QrDresult.user && QrDresult.user.name}</p>
              <p>Email: {QrDresult.user && QrDresult.user.email}</p>
              <p>
                Scanned: {QrDresult.user && QrDresult.user.scanned.toString()}
              </p>
              <button onClick={handleScanned}>Scanned Done</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ScanQR;
