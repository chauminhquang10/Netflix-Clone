const router = require("express").Router();
const listController = require("../controllers/listController");
const auth = require("../middlewares/Auth");
const authAdmin = require("../middlewares/AuthAdmin");

router
  .route("/lists")
  .get(listController.getLists)
  .post(listController.createList);

router
  .route("/lists/:id")
  .delete(listController.deleteList)
  .put(listController.updateList);

module.exports = router;
