const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthRouter = require("./Routes/AuthRouter");
const BlogRouter = require("./Routes/BlogRouter");

require("dotenv").config();
require("./Models/db");

const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cors());

app.use("/auth", AuthRouter);
app.use("/api", BlogRouter);
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
