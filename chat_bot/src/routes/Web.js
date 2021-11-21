import express from "express";
import HomeController from "../controllers/HomeController";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", HomeController.getHomePage);

  // set up nút get started , whitelisted domain
  router.post("/setup-profile", HomeController.setupProfile);

  //set up persistent menu
  router.post("/setup-persistent-menu", HomeController.setupPersistentMenu);

  //mở cái giao diện form tạo tài khoản
  router.get("/reserve-account", HomeController.handleReserveAccount);

  //xử lí cái nút nhấn Tạo tài khoản
  router.post("/reserve-account-ajax", HomeController.handlePostReserveAccount);

  router.post("/webhook", HomeController.postWebHook);
  router.get("/webhook", HomeController.getWebHook);

  return app.use("/", router);
};

module.exports = initWebRoutes;
