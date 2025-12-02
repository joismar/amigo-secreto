import { sql } from "@vercel/postgres";

type CadastroBody = {
    event_id: string;
    nickname: string;
    suggestion: string;
    email: string;
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
        const { event_id, nickname, suggestion, email, pass } = req.body;

        // Check if email already exists for this event
        const { rows } = await sql`SELECT * FROM participants WHERE email = ${email} AND event_id = ${event_id}`;
        if (rows.length) {
            res.status(409).json({ success: false });
            return;
        }

        const { rows: participants } = await sql`SELECT * FROM participants WHERE event_id = ${event_id}`;
        const admin = participants.length === 0;

        await sql`INSERT INTO participants (event_id, apelido, sugestao, email, pass, admin) VALUES (${event_id}, ${nickname}, ${suggestion}, ${email}, ${pass}, ${admin})`;
        res.status(200).end();
    }
}