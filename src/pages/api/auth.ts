import { openDb } from "@/helpers/db";

export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        const db = await openDb();
        const { nick, pass } = req.body;
        const finded = await db.get('SELECT * FROM participants WHERE apelido = ? AND pass = ?', [nick, pass]);
        if (finded) {
            res.status(200).json({ success: true });
        } else {
            res.status(401).json({ success: false });
        }
    }
}