import express, { Application, request, Request, Response } from "express";
import { startDatabase } from "./database";
import { createMovie, deleteMovie, listAllMovies, updateMovie } from "./functions";
import { validateMovieId, validateMovieName } from "./middlewares";

const app: Application = express();
app.use(express.json());

app.get("/movies", listAllMovies);
app.post("/movies", validateMovieName, createMovie);
app.delete("/movies/:id", validateMovieId, deleteMovie);
app.patch("/movies/:id", validateMovieName, validateMovieId, updateMovie);

app.listen(3000, async () => {
  await startDatabase();
  console.log("Server is on!");
});
