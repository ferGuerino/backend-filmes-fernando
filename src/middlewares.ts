import { Request, Response, NextFunction } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";
import { iMoviesRequest, MoviesResult } from "./interfaces";

const validateMovieName = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const movieRequest: iMoviesRequest = request.body;
  const queryList: string = `
        SELECT
            *
        FROM
            movies;    
    `;
  const listAllResult: MoviesResult = await client.query(queryList);

  const newList = listAllResult.rows.find((elem) => {
    return elem.name === movieRequest.name;
  });

  if (newList != undefined) {
    return response.status(409).json({
      message: "Movie already exists.",
    });
  }
  return next();
};

const validateMovieId = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = +request.params.id;

  const queryListId: string = `
    SELECT
      *
    FROM
      movies
    WHERE
      id = $1;  
  `;

  const queryConfig: QueryConfig = {
    text: queryListId,
    values: [id],
  };

  const queryResult: MoviesResult = await client.query(queryConfig);

  if (!queryResult.rowCount) {
    return response.status(404).json({
      message: "Not found",
    });
  }

  return next();
};

export { validateMovieName, validateMovieId };
