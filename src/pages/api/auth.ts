import { sql } from "@vercel/postgres";

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
        const { nick, pass } = req.body;
        const finded = await sql`SELECT * FROM participants WHERE apelido = ${nick} AND pass = ${pass}`;
        if (finded) {
            res.status(200).json({ success: true });
        } else {
            res.status(401).json({ success: false });
        }
    }
}