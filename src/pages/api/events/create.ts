import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from 'uuid';

type CreateEventBody = {
    eventName: string;
    email: string;
    pass: string;
    nickname: string;
    suggestion: string;
}

interface IRequest {
    method: string;
    body: CreateEventBody;
}

interface IResponse {
    status: (code: number) => IResponse;
    end: () => void;
    json: (data: { success: boolean, eventId?: string, participantId?: string, message?: string }) => void;
}

export default async function handler(req: IRequest, res: IResponse) {
    if (req.method === 'POST') {
        const { eventName, email, pass, nickname, suggestion } = req.body;

        if (!eventName || !email || !pass || !nickname) {
            res.status(400).json({ success: false, message: 'Missing required fields' });
            return;
        }

        try {
            // Create Event
            const eventId = uuidv4();
            await sql`INSERT INTO events (id, name) VALUES (${eventId}, ${eventName})`;

            // Create Admin Participant
            const participantId = uuidv4();

            await sql`INSERT INTO participants (id, event_id, apelido, email, pass, admin, sugestao) VALUES (${participantId}, ${eventId}, ${nickname}, ${email}, ${pass}, true,    ${suggestion})`;

            res.status(200).json({ success: true, eventId, participantId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: (error as Error).message });
        }
    } else {
        res.status(405).end();
    }
}
