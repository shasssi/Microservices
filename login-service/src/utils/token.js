const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const logger = require("./logger");
const { APIError } = require("./errorClass");

const generateAccessToken = async (payload) => {
  try {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });
    return accessToken;
  } catch (error) {
    logger.error("error generating access token", error);
  }
}

const generateAccessAndRefreshToken = async (payload) => {
  try {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });
    const refreshToken = crypto.randomBytes(40).toString("hex");
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    logger.error("error generating access and refresh token", error);
    throw new APIError();
  }
};

const validateToken = async (token) => {
  let payload = null;
  try {
    payload = await jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    logger.error("error validating token", error);
  } finally {
    return payload;
  }
};

module.exports = { generateAccessAndRefreshToken, validateToken, generateAccessToken };
