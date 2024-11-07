import { openDb } from "@/helpers/db";

export async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        const db = await openDb();
        const { id } = req.body;
        await db.run('DELETE FROM participants WHERE id = ?', [id]);
        res.status(200).end();
    }
}