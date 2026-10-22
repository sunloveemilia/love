export const adventureModes=['truths','taboo','associations','dilemmas','numbers','story'];
export function isAdventure(mode:string){return adventureModes.includes(mode);}
export function normalizeAnswer(value:string){return value.trim().toLocaleLowerCase('ru-RU').replace(/ё/g,'е').replace(/\s+/g,' ');}
