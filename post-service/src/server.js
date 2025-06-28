require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const PORT = process.env.PORT || 3001;

const app = express();

// middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    data: "hello from post service",
  });
});

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
