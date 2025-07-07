import sqlite3 from 'sqlite3';
import { Card, Game } from './objects.mjs';

export const db = new sqlite3.Database("./sfiga_universitaria.sqlite", (err) => {
    if (err) throw err;
});
