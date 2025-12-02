import { sql } from "@vercel/postgres";

type CadastroBody = {
    event: string;
    nickname: string;
    suggestion: string;
    pass: string;
}

interface IRequest {
    method: string;
    body: CadastroBody;
}

interface IResponse {
    status: (code: number) => IResponse;
    end: () => void;
    json: (data: { success: boolean }) => void;
}

export default async function handler(req: IRequest, res: IResponse) {
    if (req.method === 'POST') {
        const { event, nickname, suggestion, pass } = req.body;
        const { rows } = await sql`SELECT * FROM participants WHERE apelido = ${nickname} AND event = ${event}`;
        if (rows.length) {
            res.status(409).json({ success: false });
            return;
        }

        const { rows: participants } = await sql`SELECT * FROM participants WHERE event = ${event}`;
        const admin = participants.length === 0;

        await sql`INSERT INTO participants (event, apelido, sugestao, pass, admin) VALUES (${event}, ${nickname}, ${suggestion}, ${pass}, ${admin})`;
        res.status(200).end();
    }
}