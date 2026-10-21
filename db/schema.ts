import {integer,sqliteTable,text} from 'drizzle-orm/sqlite-core';
export const rooms=sqliteTable('rooms',{id:text('id').primaryKey(),code:text('code').notNull().unique(),revision:integer('revision').notNull().default(0),data:text('data').notNull(),updatedAt:integer('updated_at').notNull()});
export const rateLimits=sqliteTable('rate_limits',{key:text('key').primaryKey(),count:integer('count').notNull().default(0),until:integer('until').notNull()});
export const movieCache=sqliteTable('movie_cache',{key:text('key').primaryKey(),data:text('data').notNull(),until:integer('until').notNull()});
