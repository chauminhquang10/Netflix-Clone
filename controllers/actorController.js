const Actors = require("../models/actorModel");

const Movies = require("../models/movieModel");

const fs = require(`fs`);

const actorController = {
  getActors: async (req, res) => {
    try {
      const actors = await Actors.find();
      res.json(actors);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  getOneActor: async (req, res) => {
    try {
      const actor = await Actors.findById(req.params.id).populate("knownFor");
      return res.status(200).json({ actor });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  //only admin can create , update , delete actor
  createActor: async (req, res) => {
    try {
      const {
        name,
        image,
        gender,
        place_of_birth,
        birthday,
        biography,
        tmdbID,
      } = req.body;
      const actor = await Actors.findOne({ name: name.toLowerCase() });
      if (actor)
        return res.status(400).json({ msg: "This actor already exist!" });

      const newActor = new Actors({
        name: name.toLowerCase(),
        image,
        gender,
        place_of_birth,
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
  loadActor: async (req, res) => {
    try {
      let rawdata = fs.readFileSync("./NewActor.json");

      let actors = JSON.parse(rawdata);

      await Actors.insertMany(actors);

      res.json({ msg: "Created a new actor" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateActors: async (req, res) => {
    try {
      let rawdata = fs.readFileSync("./UpdatedActors.json");

      let actors = JSON.parse(rawdata);

      await actors.forEach(async (actor) => {
        console.log(`updating ${actor["_id"]} with ${actor["knownFor"]}`);
        const a = await Actors.updateOne(
          { tmdbID: actor["_id"] },
          { knownFor: actor["knownFor"] }
        );
      });

      res.json({ msg: "Actors Updated" });
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

  deleteActors: async (req, res) => {
    try {
      const a = await Actors.deleteMany({ knownFor: [] });
      res.json({ msg: "Actors Deleted" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  updateActor: async (req, res) => {
    try {
      const {
        name,
        image,
        gender,
        place_of_birth,
        birthday,
        biography,
        tmdbID,
      } = req.body;
      await Actors.findOneAndUpdate(
        { _id: req.params.id },
        {
          name: name.toLowerCase(),
          image,
          gender,
          place_of_birth,
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
