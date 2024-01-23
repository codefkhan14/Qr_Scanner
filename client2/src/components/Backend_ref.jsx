let backend_ref;
if (process.env.NODE_ENV === "production") {
  backend_ref = process.env.REACT_APP_HOST_SERVER_KEY;
} else if (process.env.NODE_ENV === "development") {
  backend_ref = process.env.REACT_APP_LOCAL_SERVER_KEY;
}

export default backend_ref;
