const Lists = require("../models/listModel");
const Movies = require("../models/movieModel");

const { ObjectId } = require("mongodb");

const listController = {
  //lay random 5 lists
  getLists: async (req, res) => {
    try {
      const lists = await Lists.aggregate([{ $sample: { size: 5 } }]);
      res.json(lists);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  //only admin can create , update , delete list
  createList: async (req, res) => {
    try {
      const { title, genre } = req.body;
      const list = await Lists.findOne({ title: title.toLowerCase() });
      if (list)
        return res.status(400).json({ msg: "This list already exist!" });

      // check trường hợp trùng phim trong 2 list (dựa vào listId)
      const pushMovies = await Movies.aggregate([
        {
          $match: {
            allGenres: {
              $in: [ObjectId(genre)],
            },
            listId: null,
          },
        },
        { $sample: { size: 10 } },
      ]);

      if (pushMovies.length !== 10)
        return res.status(400).json({
          msg: "Can't create new list because of not having enough movie to fit in the list!",
        });

      const newList = new Lists({
        title: title.toLowerCase(),
        genre,
        items: pushMovies,
      });
      const saveList = await newList.save();

      // đánh listId cho các phim được chọn
      pushMovies.filter((movieItem) => {
        return updateListIdForMovies(movieItem, saveList._id);
      });

      res.json({ msg: "Created a new list", createdList: saveList });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteList: async (req, res) => {
    try {
      // xóa listId ra khỏi các phim của list
      const deleteList = await Lists.findById(req.params.id);
      const { items } = deleteList;
      items.filter((movieItem) => {
        return deleteListIdForMovies(movieItem);
      });

      await Lists.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted a list!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateList: async (req, res) => {
    try {
      const { title, genre } = req.body;

      const neededList = await Lists.findById(req.params.id);

      const { items } = neededList;

      const removeItems = [...items];

      const movies = await Movies.aggregate([
        {
          $match: {
            allGenres: {
              $in: [ObjectId(genre)],
            },
            listId: null,
          },
        },
        { $sample: { size: 10 } },
      ]);

      if (movies.length !== 10)
        return res.status(400).json({
          msg: "Can't update because of not having enough movie to fit in the list!",
        });

      const saveList = await Lists.findOneAndUpdate(
        { _id: req.params.id },
        { title: title.toLowerCase(), genre, items: movies }
      );

      // đánh listId cho các phim được chọn
      movies.filter((movieItem) => {
        return updateListIdForMovies(movieItem, saveList._id);
      });

      // xóa listId ra khỏi các phim cũ của list
      removeItems.filter((movieItem) => {
        return deleteListIdForMovies(movieItem);
      });

      res.json({ msg: "Updated a list!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

// hàm update listId (đánh listId) cho các phim được chọn
const updateListIdForMovies = async (movieItem, listId) => {
  await Movies.findOneAndUpdate(
    { _id: movieItem._id },
    {
      listId,
    }
  );
};

// hàm xóa listId  cho các phim cũ được chọn
const deleteListIdForMovies = async (movieItem) => {
  await Movies.findOneAndUpdate(
    { _id: movieItem._id },
    {
      listId: undefined,
    }
  );
};

module.exports = listController;
