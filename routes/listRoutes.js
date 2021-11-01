const router = require("express").Router();
const listController = require("../controllers/listController");
const auth = require("../middlewares/Auth");
const authAdmin = require("../middlewares/AuthAdmin");

router
  .route("/lists")
  .get(listController.getLists)
  .post(auth, authAdmin, listController.createList);

router
  .route("/lists/:id")
  .delete(auth, authAdmin, listController.deleteList)
  .put(auth, authAdmin, listController.updateList);

module.exports = router;
