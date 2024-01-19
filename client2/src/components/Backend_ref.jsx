let backend_ref;
if (process.env.NODE_ENV === "production") {
  backend_ref = process.env.REACT_APP_HOST_SERVER_KEY;
  // backend_ref = "https://qr-scanner-n432.onrender.com"
} else if (process.env.NODE_ENV === "development") {
  backend_ref = process.env.REACT_APP_LOCAL_SERVER_KEY;
//   backend_ref = "http://localhost:8000"
}

export default backend_ref;
