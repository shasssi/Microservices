const bcrypt = require("bcrypt");
const { APIError } = require("./errorClass");
const logger = require("./logger");

const generateHash = async (text) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(text, salt);
    return hash;
  } catch (error) {
    logger.error("error while generating password", error);
    throw new APIError();
  }
};

const compareHash = async (text, hash) => {
  try {
    const isMatch = await bcrypt.compare(text, hash);
    return isMatch;
  } catch (error) {
    logger.error("error while comparing password", error);
    throw new APIError();
  }
};

module.exports = { generateHash, compareHash };
