import { sql } from "@vercel/postgres";
import { Event } from "@/helpers/types";

interface IRequest {
    method: string;
    query: {
        id: string;
    };
}

interface IResponse {
    status: (code: number) => IResponse;
    end: () => void;
    json: (data: { success: boolean, event?: Event, message?: string }) => void;
}

export default async function handler(req: IRequest, res: IResponse) {
    if (req.method === 'GET') {
        const { id } = req.query;

        if (!id) {
            res.status(400).json({ success: false, message: 'Missing event ID' });
            return;
        }

        try {
            const { rows } = await sql<Event>`SELECT * FROM events WHERE id = ${id}`;

            if (rows.length === 0) {
                res.status(404).json({ success: false, message: 'Event not found' });
                return;
            }

            res.status(200).json({ success: true, event: rows[0] });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: (error as Error).message });
        }
    } else {
        res.status(405).end();
    }
}
