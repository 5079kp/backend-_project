import Movie from "../models/movies.js";

//ADD Movie

export const addMovie = async (req, res) => {
  try {
    const newMovie = new Movie({
      title: req.body.title,
      description: req.body.description,
      image: req.file?.path || "",
      trailerLink: req.body.trailerLink,
      rating: req.body.rating,
      reviews: req.body.reviews || []
    });

    await newMovie.save();
    res.json(newMovie);
  } catch (error) {
    res.status(500).json(error);
  }
};


//GET ALL MOVIES
export const getMovies = async (req, res) => {
     const movies = await Movie.find();
     res.json(movies);
    };

    //GET ONE

    export const  getMovie = async (req, res) =>{
        const movieData =await Movie.findById(req.params.id);
        res.json(movieData);
    };

    //DELETE MOVIE
    export const deleteMovie =async (req, res) => {
        const movieData =await Movie.findByIdAndDelete(req.params.id);
        res.json(movieData);
    };

    //UPDATE MOVIE
    export const updateMovie = async (req, res) => {
      try {
        const updatePayload = {
          title: req.body.title,
          description: req.body.description,
          rating: req.body.rating,
          trailerLink: req.body.trailerLink,
        };

        if (req.file) {
          updatePayload.image = req.file.path;
        }

        const movieData = await Movie.findByIdAndUpdate(req.params.id, updatePayload, { new: true });
        res.json(movieData);
      } catch (error) {
        res.status(500).json(error);
      }
    };