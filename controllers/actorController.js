const Actors = require("../models/actorModel");

const Movies = require("../models/movieModel");

const actorController = {
  getActors: async (req, res) => {
    try {
      const actors = await Actors.find();
      res.json(actors);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  //only admin can create , update , delete actor
  createActor: async (req, res) => {
    try {
      const { name, image, gender, placeOfBirth, birthday, biography, tmdbID } =
        req.body;
      const actor = await Actors.findOne({ name: name.toLowerCase() });
      if (actor)
        return res.status(400).json({ msg: "This actor already exist!" });

      const newActor = new Actors({
        name: name.toLowerCase(),
        image,
        gender,
        placeOfBirth,
        birthday,
        biography,
        tmdbID,
      });
      await newActor.save();
      res.json({ msg: "Created a new actor" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteActor: async (req, res) => {
    try {
      // xóa những phim có diễn viên này tham gia trước.
      const deleteActorMovies = await Movies.find({
        actorsBelongTo: req.params.id,
      });

      deleteActorMovies.filter((movie) => {
        return deleteActorFromMovie(movie._id, req.params.id);
      });

      await Actors.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted a actor!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateActor: async (req, res) => {
    try {
      const { name, image, gender, placeOfBirth, birthday, biography, tmdbID } =
        req.body;
      await Actors.findOneAndUpdate(
        { _id: req.params.id },
        {
          name: name.toLowerCase(),
          image,
          gender,
          placeOfBirth,
          birthday,
          biography,
          tmdbID,
        }
      );
      res.json({ msg: "Updated a actor!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const deleteActorFromMovie = async (movieId, actorId) => {
  await Movies.findOneAndUpdate(
    { _id: movieId },
    {
      $pull: { actorsBelongTo: actorId },
    },
    { new: true }
  );
};

module.exports = actorController;
