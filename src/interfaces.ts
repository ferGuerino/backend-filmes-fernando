import { QueryResult } from "pg";

interface iMoviesRequest {
  name: string;
  description: string;
  duration: number;
  price: number;
}

interface iMovies extends iMoviesRequest {
  id: number;
}
interface iPagination {
  prevPage: string;
  nextPage: string;
  count: number;
  data: iMovies[];
}

type MoviesResult = QueryResult<iMovies>;

export { iMoviesRequest, iMovies, MoviesResult, iPagination };
