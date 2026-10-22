import {builtinMovie,selectMovies} from './builtin-movies.ts';
import type {Data} from './engine.ts';
export {filtersFor} from './movie-rules.ts';
// Always available: there is no external catalogue, credential, or runtime network call.
export async function movieDetails(id:number){return builtinMovie(id);}
export async function catalogue(c:Data,input:Data={},archive:Data[]=[],pid?:string,forDeck=false){return selectMovies(c,input,archive,pid,forDeck);}
