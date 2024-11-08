import { sql } from "@vercel/postgres";

type DeleteBody = {
    id: string;
}

interface IRequest {
    method: string;
    body: DeleteBody;
}

interface IResponse {
    status: (code: number) => IResponse;
    end: () => void;
}

export default async function handler(req: IRequest, res: IResponse) {
    if (req.method === 'POST') {
        const { id } = req.body;
        await sql`DELETE FROM participants WHERE id = ${id}`;
        res.status(200).end();
    }
}