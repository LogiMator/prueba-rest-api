const express = require("express");
const crypto = require("node:crypto");
const movies = require("./movies.json");
const cors = require("cors");
const { validateMovie, validatePartialMovie } = require("./scheme/movies.js");

const app = express();
app.use(express.json());
app.use(cors());
app.disable("x-powered-by");

const ACCES_ORIGIN = [
  "http://localhost:1234",
  "http://localhost:8080",
  "http://localhost:3000",
  "http://localhost:6969",
  "http://localhost:3003",
];

const PORT = process.env.PORT ?? 1234;

app.get("/movies", (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const filterMovie = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filterMovie);
  }
  res.json(movies);
});

app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (movie) return res.json(movie);

  res.status(404).json({ message: "movie not found" });
});

app.post("/movies", (req, res) => {
  const result = validateMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

app.delete("movies/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => {
    movie.id === id;
  });
  const origin = req.header("origin");
  if (ACCES_ORIGIN.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  if (movieIndex === -1) {
    return res.status(400).json({ message: "movie not found" });
  }

  return res.json({ message: "movie deleted" });
});

app.patch("/movies/:id", (req, res) => {
  const result = validatePartialMovie(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data,
  };

  movies[movieIndex] = updatedMovie;

  return res.json(updatedMovie);
});

app.listen(PORT, () => {
  console.log(`servidor listen on port http://localhost:${PORT}`);
});
