require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const loginRoutes = require("./routes/login-routes");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", loginRoutes);

app.get("/", (req, res) => {
  console.log(req.cookies);
  return res.json({
    success: true,
    data: "hello from login service",
  });
});

// error handler
app.use(errorHandler);

app.listen(PORT, () => `login service started at ${PORT}`);
