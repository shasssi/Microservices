const {
  BadRequestError,
  APIError,
  AuthorizationError,
} = require("../utils/errorClass");
const { generateHash, compareHash } = require("../utils/hash");
const logger = require("../utils/logger");
const {
  generateAccessAndRefreshToken,
  generateAccessToken,
} = require("../utils/token");
const { validateUserRegistration } = require("../utils/validation");
const prisma = require("./../config/prisma");
const dayjs = require("dayjs");

const registerUser = async (req, res, next) => {
  try {
    logger.info(`url: ${req.url} controller: registerUser`);
    const { error } = validateUserRegistration(req.body);
    if (error) {
      return next(new BadRequestError(error.details[0].message));
    }
    const { email, name, password } = req.body;
    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      return next(new BadRequestError("user already exist"));
    }
    const hashedPassword = await generateHash(password);
    user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken({
      userId: user.id,
      email,
    });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // expres in 7 days
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        expiresAt,
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.json({
      suceess: true,
      data: {
        accessToken,
        userId: user.id,
      },
    });
  } catch (error) {
    logger.error(`error in controller: registerUser`, error);
    throw new APIError("Internal server error");
  }
};

const loginController = async (req, res, next) => {
  try {
    logger.info(`url: ${req.url} controller: loginController`);
    const { error } = validateUserRegistration(req.body);
    if (error) {
      return next(new BadRequestError(error.details[0].message));
    }

    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return next(new BadRequestError("user does not exist"));
    }

    const isPasswordMatched = await compareHash(password, user.password);
    if (isPasswordMatched) {
      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        { userId: user.id, email }
      );
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // expres in 7 days
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          expiresAt,
        },
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      });

      return res.json({
        suceess: true,
        data: {
          accessToken,
          userId: user.id,
        },
      });
    } else {
      return next(new BadRequestError("user credential incorrect"));
    }
  } catch (error) {
    logger.error(`error in controller: loginController`, error);
    throw new APIError("Internal server error");
  }
};

const refreshTokenContoller = async (req, res, next) => {
  try {
    logger.info(`url: ${req.url} controller: refreshTokenContoller`);
    if (!req.cookies.refreshToken) {
      return next(new AuthorizationError("no refresh token exist"));
    }
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: req.cookies.refreshToken,
      },
    });
    if (!storedToken) {
      res.clearCookie("refreshToken");
      return next(new AuthorizationError("user authentication expired"));
    }

    const isExpired =
      dayjs(storedToken.expiresAt).format("YYYY-MM-DD") <
      dayjs().format("YYYY-MM-DD");

    if (isExpired) {
      res.clearCookie("refreshToken");
      return next(new AuthorizationError("user authentication expired"));
    }

    const { userId } = req.body;
    const accessToken = await generateAccessToken({ userId });

    return res.json({
      success: true,
      data: {
        accessToken,
      },
    });
  } catch (error) {
    logger.error(`error in controller: refreshTokenContoller`, error);
    throw new APIError("Internal server error");
  }
};

module.exports = { registerUser, loginController, refreshTokenContoller };
