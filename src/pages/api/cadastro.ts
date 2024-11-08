import { sql } from "@vercel/postgres";

type CadastroBody = {
    id: string;
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
        const { id, nickname, suggestion, pass } = req.body;
        const { rows } = await sql`SELECT * FROM participants WHERE apelido = ${nickname} AND id = ${id}`;
        if (rows.length) {
            res.status(409).json({ success: false });
            return;
        }
        await sql`INSERT INTO participants (id, apelido, sugestao, pass) VALUES (${id}, ${nickname}, ${suggestion}, ${pass})`;
        res.status(200).end();
    }
}