import { sql } from "@vercel/postgres";
import { Participant } from "@/helpers/types";

type DeleteBody = {
    event: string;
    adminNick: string;
    adminPass: string;
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
        const { event, adminNick, adminPass } = req.body;

        // Verify admin
        const { rows: admins } = await sql<Participant>`SELECT * FROM participants WHERE event = ${event} AND apelido = ${adminNick} AND pass = ${adminPass} AND admin = true`;
        if (admins.length === 0) {
            return res.status(403).end();
        }

        await sql`DELETE FROM participants WHERE event = ${event}`;
        res.status(200).end();
    }
}