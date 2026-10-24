import {modes} from './content.ts';
export const movedNearbyIds=['who','truths','taboo','wheel'];
export const remoteModes=modes.filter(m=>![...movedNearbyIds,'capsule','cinema'].includes(m.id));
export const remoteSurpriseModes=['telepathy','swap','disaster','associations','dilemmas'];
