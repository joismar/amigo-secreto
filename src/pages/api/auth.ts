import { openDb } from "@/helpers/db";

type AuthBody = {
    nick: string;
    pass: string;
}

interface IRequest {
    method: string;
    body: AuthBody;
}

interface IResponse {
    status: (code: number) => IResponse;
    end: () => void;
    json: (data: {
        success: boolean;
    }) => void;
}

export default async function handler(req: IRequest, res: IResponse) {
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