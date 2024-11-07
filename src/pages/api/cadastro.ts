import { openDb } from "@/helpers/db";

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
}

export default async function handler(req: IRequest, res: IResponse) {
    if (req.method === 'POST') {
        const db = await openDb();
        const { id, nickname, suggestion, pass } = req.body;
        await db.run('INSERT INTO participants (id, apelido, sugestao, pass) VALUES (?, ?, ?, ?)', [id, nickname, suggestion, pass]);
        res.status(200).end();
    }
}