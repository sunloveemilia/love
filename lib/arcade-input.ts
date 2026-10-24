// Input ownership is separate from game state: releasing one source must not
// cancel another finger or a keyboard key held by the same player.
export class ArcadeInputs{
 pointers=new Map<number,number>();
 keyboard=new Map<string,number>();
 isHeld(player:number){return [...this.pointers.values(),...this.keyboard.values()].includes(player);}
 pressPointer(id:number,player:number){if(!Number.isInteger(id)||!Number.isInteger(player)||player<0||player>3||this.pointers.has(id))return false;const was=this.isHeld(player);this.pointers.set(id,player);return !was;}
 releasePointer(id:number){const player=this.pointers.get(id);if(player===undefined)return null;this.pointers.delete(id);return this.isHeld(player)?null:player;}
 pressKey(key:string,player:number){if(this.keyboard.has(key)||!Number.isInteger(player)||player<0||player>3)return false;const was=this.isHeld(player);this.keyboard.set(key,player);return !was;}
 releaseKey(key:string){const player=this.keyboard.get(key);if(player===undefined)return null;this.keyboard.delete(key);return this.isHeld(player)?null:player;}
 clear(){this.pointers.clear();this.keyboard.clear();}
}
export function arcadeDelta(previous:number,current:number){const seconds=(current-previous)/1000;if(!Number.isFinite(seconds)||seconds<0||seconds>.5)return{seconds:0,pause:true};return{seconds,pause:false};}
