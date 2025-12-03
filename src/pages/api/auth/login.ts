import { sql } from "@vercel/postgres";
import { Participant, Event } from "@/helpers/types";

interface IRequest {
    method: string;
    body: {
        email: string;
        pass: string;
    };
}

interface IResponse {
    status: (code: number) => IResponse;
    end: () => void;
    json: (data: { success: boolean, events?: { event: Event, participantId: string, isAdmin: boolean }[], message?: string }) => void;
}

export default async function handler(req: IRequest, res: IResponse) {
    if (req.method === 'POST') {
        const { email, pass } = req.body;

        if (!email || !pass) {
            res.status(400).json({ success: false, message: 'Missing email or password' });
            return;
        }

        try {
            const { rows: participants } = await sql<Participant>`
                SELECT * FROM participants 
                WHERE email = ${email} AND pass = ${pass}
            `;

            if (participants.length === 0) {
                res.status(401).json({ success: false, message: 'Invalid credentials' });
                return;
            }

            const eventsData = await Promise.all(participants.map(async (p) => {
                const { rows: eventRows } = await sql<Event>`SELECT * FROM events WHERE id = ${p.event_id}`;
                if (eventRows.length > 0) {
                    return {
                        event: eventRows[0],
                        participantId: p.id,
                        isAdmin: p.admin
                    };
                }
                return null;
            }));

            const validEvents = eventsData.filter(e => e !== null) as { event: Event, participantId: string, isAdmin: boolean }[];

            res.status(200).json({ success: true, events: validEvents });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: (error as Error).message });
        }
    } else {
        res.status(405).end();
    }
}
