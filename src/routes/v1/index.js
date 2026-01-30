import express from "express";
import healthRoute from "./health.route.js";
import userRoute from "./user.route.js";
import authRoute from "./auth.route.js";
import itemRoute from "./item.route.js";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/health",
    route: healthRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/items",
    route: itemRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
