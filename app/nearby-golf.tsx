'use client';
import {useRef,useState} from 'react';
import {Flag,Target} from 'lucide-react';
import {golfCourses,type GolfState} from '../lib/nearby-boards';
const colors=['#85e4c4','#f3a6c8'];
export function NearbyGolf({state:s,names,disabled,shoot}:{state:GolfState;names:string[];disabled:boolean;shoot:(angle:number,power:number)=>void}){
 const [angle,setAngle]=useState(-30),[power,setPower]=useState(65),[dragging,setDragging]=useState(false),pointer=useRef<number|null>(null),aim=useRef({angle:-30,power:65}),course=golfCourses[s.course],ball=s.balls[s.turn];
 const canShoot=!disabled&&!s.moving&&s.phase==='playing',radians=angle*Math.PI/180,line=30+power*1.5;
 function setAim(a:number,p:number){aim.current={angle:a,power:p};setAngle(a);setPower(p);}
 function point(e:React.PointerEvent<SVGSVGElement>){const box=e.currentTarget.getBoundingClientRect();return{x:(e.clientX-box.left)/box.width*800,y:(e.clientY-box.top)/box.height*440};}
 function move(e:React.PointerEvent<SVGSVGElement>){if(pointer.current!==e.pointerId)return;const p=point(e),dx=ball.x-p.x,dy=ball.y-p.y;setAim(Math.atan2(dy,dx)*180/Math.PI,Math.max(1,Math.min(100,Math.hypot(dx,dy)/1.5)));}
 function cancel(){pointer.current=null;setDragging(false);}
 return <div className="nb-golf">
 <div className="nb-course-caption"><span><Flag size={17}/>Лунка {s.course+1} / 3 · {course.name}</span><span>Не больше 8 ударов на лунку</span></div>
 <svg viewBox="0 0 800 440" className="nb-course" aria-label={`Поле мини-гольфа. Лунка ${s.course+1}. Ход: ${names[s.turn]}`} role="img" onContextMenu={e=>e.preventDefault()} onPointerDown={e=>{if(!canShoot||pointer.current!==null||e.button>0)return;const p=point(e);if(Math.hypot(p.x-ball.x,p.y-ball.y)>75)return;e.preventDefault();pointer.current=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);setDragging(true);setAim(angle,1);}} onPointerMove={move} onPointerUp={e=>{if(pointer.current!==e.pointerId)return;move(e);const a=aim.current;cancel();if(canShoot&&a.power>=5)shoot(a.angle,a.power);}} onPointerCancel={cancel} onLostPointerCapture={cancel}>
 <defs><pattern id="nb-grass" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M0 0h40v40H0z" fill="#173f35"/><path d="M0 0h20v40H0z" fill="#1a4439"/></pattern></defs>
 <rect x="0" y="0" width="800" height="440" rx="22" fill="#122b28"/><rect x="9" y="9" width="782" height="422" rx="16" fill="url(#nb-grass)" stroke="#82b99b" strokeWidth="4"/>
 <circle cx={course.start.x} cy={course.start.y} r="28" stroke="#8ccdb1" strokeDasharray="3 7" fill="none" opacity=".3"/>
 {course.walls.map((w,i)=><g key={i}><rect {...{x:w.x+3,y:w.y+5,width:w.w,height:w.h}} rx="5" fill="#061e1e"/><rect x={w.x} y={w.y} width={w.w} height={w.h} rx="5" fill="#a7c3aa"/><path d={`M${w.x+4} ${w.y+4}h${w.w-8}`} stroke="#e1f1cb" strokeWidth="2"/></g>)}
 <circle cx={course.hole.x} cy={course.hole.y} r="17" fill="#071b1c" stroke="#a6d6ad" strokeWidth="3"/><path d={`M${course.hole.x} ${course.hole.y-3}v-48l33 12-33 10`} stroke="#f0d58c" fill="#f0d58c" strokeWidth="2"/>
 {s.balls.map((b,i)=>s.done[i]?null:<g key={i} opacity={i===s.turn?1:.3}>{i===s.turn&&canShoot&&<><circle cx={b.x} cy={b.y} r="20" stroke={colors[i]} fill="none" strokeWidth="1.5"/><path d={`M${b.x} ${b.y}L${b.x+Math.cos(radians)*line} ${b.y+Math.sin(radians)*line}`} stroke={colors[i]} strokeWidth="3" strokeDasharray="6 6"/><circle cx={b.x+Math.cos(radians)*line} cy={b.y+Math.sin(radians)*line} r="5" fill={colors[i]}/></>}<circle cx={b.x+2} cy={b.y+4} r="10" fill="#071f1c"/><circle cx={b.x} cy={b.y} r="9" fill={colors[i]} stroke="#fff" strokeWidth="2"/></g>)}
 </svg>
 <p className="nb-hint">{s.moving?'Мяч катится… следующий ход — после остановки.':dragging?'Отпусти палец, чтобы ударить. Сильнее оттянул — сильнее удар.':'Оттяни палец от мяча в обратную сторону и отпусти. Или настрой удар ниже.'}</p>
 <div className="nb-aim"><label><span>Направление <b>{Math.round(angle)}°</b></span><input aria-label="Направление удара" type="range" min="-180" max="180" value={angle} disabled={!canShoot} onChange={e=>setAim(+e.target.value,power)}/></label><label><span>Сила <b>{Math.round(power)}%</b></span><input aria-label="Сила удара" type="range" min="1" max="100" value={power} disabled={!canShoot} onChange={e=>setAim(angle,+e.target.value)}/></label><button className="button primary near-button" disabled={!canShoot} onClick={()=>shoot(angle,power)}><Target size={19}/>Ударить</button></div>
 {s.history.length>0&&<div className="nb-golf-history"><span>Пройденные лунки</span>{s.history.map((h,i)=><span key={i}>{i+1}: {h[0]} / {h[1]}</span>)}</div>}
 </div>;
}
