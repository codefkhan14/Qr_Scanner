import axios from "axios";
import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import backend_ref from "./Backend_ref";
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 font-sans">
          <div className="border-2 border-gray-900 p-20 bg-gray-50 rounded-lg shadow-md">
            <h3 className="my-5 font-bold uppercase text-2xl">User Data</h3>
            <p className=" my-3 text-xl">
              {" "}
              <span className="font-bold">Name</span> :{" "}
              {QrDresult.user && QrDresult.user.name}
            </p>
            <p className="my-3 text-xl">
              {" "}
              <span className="font-bold">Email</span> :{" "}
              {QrDresult.user && QrDresult.user.email}
            </p>
            <p
              className={
                QrDresult.user.scanned
                  ? "text-green-600 my-3 text-xl"
                  : "text-red-600 my-3 text-xl"
              }
            >
              <span className="font-bold">Scanned</span> :
              {QrDresult.user.scanned ? <> Already Scanned</> : <> False</>}
            </p>

            {QrDresult.user.scanned ? (
              <></>
            ) : !buttonLoader ? (
              <button onClick={handleScanned} className="bg-green-600 scan-btn">
                Scan now
              </button>
            ) : (
              <button className="bg-green-400 scan-btn">Loading...</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanQR;
