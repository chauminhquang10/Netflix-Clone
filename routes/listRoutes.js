const router = require("express").Router();
const listController = require("../controllers/listController");
const auth = require("../middlewares/Auth");
const authAdmin = require("../middlewares/AuthAdmin");

router
  .route("/lists")
  .get(listController.getAllLists)
  .post(auth, authAdmin, listController.createList);

// get all list for admin dashboard
router.route("/top5Lists").get(listController.getTop5Lists);

router
  .route("/lists/:id")
  .delete(auth, authAdmin, listController.deleteList)
  .put(auth, authAdmin, listController.updateList);

module.exports = router;
