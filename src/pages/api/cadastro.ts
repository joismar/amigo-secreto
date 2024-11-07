import { openDb } from "@/helpers/db";

export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        const db = await openDb();
        const { id, nickname, suggestion, pass } = req.body;
        await db.run('INSERT INTO participants (id, apelido, sugestao, pass) VALUES (?, ?, ?, ?)', [id, nickname, suggestion, pass]);
        res.status(200).end();
    }
}