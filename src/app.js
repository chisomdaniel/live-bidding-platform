import express from "express";
import helmet from "helmet";
import cors from "cors";
import httpStatus from "http-status";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config/config.js";
import * as morgan from "./config/morgan.js";
import passportConfig from "./config/passport.js";
import routes from "./routes/v1/index.js";
import { errorConverter, errorHandler } from "./middlewares/error.js";
import ApiError from "./utils/ApiError.js";

const app = express();

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
// app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", passportConfig.jwtStrategy);

// v1 api routes
app.use("/v1", routes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the public folder (React build)
app.use(express.static(path.join(__dirname, "../public")));

// Handle SPA fallback
app.get(/.*/, (req, res, next) => {
  if (req.originalUrl.startsWith("/v1")) {
    return next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
  }
  res.sendFile(path.join(__dirname, "../public/index.html"), (err) => {
    if (err) {
      next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
    }
  });
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
