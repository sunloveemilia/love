import {auth,limit} from '../two/route';
import {catalogue,movieDetails,filtersFor} from '../../../lib/movies';
import {eligibleMovie} from '../../../lib/engine';
export const dynamic='force-dynamic';
export async function GET(req:Request){try{const a=await auth(req);if(!a)return Response.json({error:'Войдите в комнату'},{status:401});await limit(req,'movies',30);const u=new URL(req.url);if(u.searchParams.has('id')){const movie=await movieDetails(Number(u.searchParams.get('id')));if(!eligibleMovie(movie,{min:60,max:180,horror:true,date:a.room.cinema.date}))throw new Error('Фильм не подходит под ограничения сеанса');return Response.json({movie},{headers:{'Cache-Control':'no-store'}});}const input=Object.fromEntries(u.searchParams);return Response.json(await catalogue(a.room.cinema,{...input,horror:input.horror==='true'},a.room.archive,a.pid),{headers:{'Cache-Control':'no-store'}});}catch(e){return Response.json({error:(e as Error).message},{status:400});}}
