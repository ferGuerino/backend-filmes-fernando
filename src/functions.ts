import { request, Request, Response } from "express";
import { QueryConfig } from "pg";
import format, { string } from "pg-format";
import { client } from "./database";
import { iMovies, iMoviesRequest, iPagination, MoviesResult } from "./interfaces";

const listAllMovies = async (request: Request, response: Response): Promise<Response> => {
  const id: number = +request.params.id;
  let perPage: number = request.query.perPage === undefined ? 5 : +request.query.perPage;
  let page: number = request.query.page === undefined ? 0 : +request.query.page;

  if (page > 0) {
    page = page - 1;
  }

  page = page * perPage;

  const queryList: string = `
        SELECT
            *
        FROM
            movies
        LIMIT $1 OFFSET $2; 
    `;

  const queryConfigPage: QueryConfig = {
    text: queryList,
    values: [perPage, page],
  };

  const queryResult: MoviesResult = await client.query(queryConfigPage);

  const baseUrl: string = `http://localhost:3000/movies`;

  let countPage: number = Number(request.query.page);
  let countPerPage: number = queryResult.rows.length;
  let prevPage: string = `${baseUrl}?page=${countPage - 1}&perPage=${perPage}`;
  let nextPage: string = `${baseUrl}?page=${countPage + 1}&perPage=${perPage}`;

  if (countPage === 1 || !countPage) {
    prevPage = "null";
  }
  if (countPerPage === 0 || countPerPage < perPage) {
    nextPage = "null";
  }

  const pagination: iPagination = {
    prevPage: prevPage,
    nextPage: nextPage,
    count: countPerPage,
    data: queryResult.rows,
  };

  return response.status(200).json(pagination);
};

const createMovie = async (request: Request, response: Response): Promise<Response> => {
  const movieRequest: iMoviesRequest = request.body;

  const queryCreate: string = format(
    `
        INSERT INTO
            movies(%I)
        VALUES
            (%L)
        RETURNING *;
      `,
    Object.keys(movieRequest),
    Object.values(movieRequest)
  );

  const queryResult: MoviesResult = await client.query(queryCreate);
  const newMovies: iMovies = queryResult.rows[0];

  return response.status(201).json(newMovies);
};

const deleteMovie = async (request: Request, response: Response): Promise<Response> => {
  const id: number = +request.params.id;

  const queryDelete: string = `
    DELETE FROM
      movies
    WHERE
      id = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryDelete,
    values: [id],
  };

  const queryResult: MoviesResult = await client.query(queryConfig);

  return response.status(204).json();
};

const updateMovie = async (request: Request, response: Response): Promise<Response> => {
  const id: number = +request.params.id;
  const movieData = Object.values(request.body);
  const movieKeys = Object.keys(request.body);

  const queryUpdate: string = format(
    `
    UPDATE
      movies
    SET(%I) = ROW(%L)
    WHERE 
      id = $1
    RETURNING *;  
  `,
    movieKeys,
    movieData
  );

  const queryConfig: QueryConfig = {
    text: queryUpdate,
    values: [id],
  };

  const queryResult: MoviesResult = await client.query(queryConfig);

  return response.status(200).json(queryResult.rows[0]);
};

export { listAllMovies, createMovie, deleteMovie, updateMovie };
