const router = require("express").Router();
const List = require("../models/List");
const verify = require("../middlewares/verifyToken");

//create new list

router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new List(req.body);
    try {
      const savedList = await newList.save();
      return res.status(201).json(savedList);
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json({ msg: "You're not allowed!" });
  }
});

//delete

router.delete("/:listId", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await List.findByIdAndDelete(req.params.listId);
      return res.status(200).json({ msg: "The list has been deleted!" });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json({ msg: "You're not allowed!" });
  }
});

//(có r)
//get lists (get nhieu list)

router.get("/", verify, async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  let lists = [];
  try {
    if (typeQuery) {
      if (genreQuery) {
        lists = await List.aggregate([
          { $match: { type: typeQuery, genre: genreQuery } },
          { $sample: { size: 10 } },
        ]);
      } else {
        lists = await List.aggregate([
          { $match: { type: typeQuery } },
          { $sample: { size: 10 } },
        ]);
      }
    } else {
      lists = await List.aggregate([{ $sample: { size: 10 } }]);
    }
    return res.status(200).json(lists);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
