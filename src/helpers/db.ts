import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

type Database = sqlite3.Database;

export async function openDb() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS participants (
      id TEXT,
      apelido TEXT,
      sugestao TEXT,
      sorteado TEXT,
      pass TEXT
    );
  `);

  return db;
}
