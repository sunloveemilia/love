'use client';
import {Film} from 'lucide-react';
import type {CSSProperties} from 'react';
const palettes=[['#242147','#926fbc'],['#143c3c','#80bca0'],['#4c253b','#cb8e99'],['#34304a','#a9aed8'],['#443022','#c1a36d'],['#1b344b','#6fb1c1']];
export function MovieArtwork({movie,decorative=false}:{movie:Record<string,any>,decorative?:boolean}){const [dark,light]=palettes[Math.abs(Number(movie.id)||0)%palettes.length];return <div className={'movie-artwork '+(decorative?'decorative':'')} aria-hidden="true" style={{'--cover-dark':dark,'--cover-light':light} as CSSProperties}><span className="cover-label">TWO FILM LIBRARY</span><div className="cover-orbit"><Film size={36} strokeWidth={1}/></div><strong>{movie.title}</strong><span className="cover-year">{movie.release_date?.slice(0,4)}<i/> {movie.genres?.[0]?.name||'Кино на двоих'}</span></div>;}
