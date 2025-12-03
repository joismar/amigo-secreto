import { Participant } from "@/helpers/types";
import { sql } from "@vercel/postgres";

type ShuffleBody = {
  event_id: string;
}

interface IRequest {
  method: string;
  body: ShuffleBody;
}

interface IResponse {
  status: (code: number) => IResponse;
  end: () => void;
}

export default async function handler(req: IRequest, res: IResponse) {
  if (req.method === 'POST') {
    try {
      const { event_id } = req.body;

      const { rows: participants } = await sql<Participant>`SELECT * FROM participants WHERE event_id = ${event_id}`;

      if (participants.length < 2) return res.status(400).end();

      let shuffled = [...participants];
      let attempts = 0;
      do {
        shuffled = shuffleArray(participants);
        attempts++;
      } while (hasSelfAssignment(participants, shuffled) && attempts < 100);

      if (hasSelfAssignment(participants, shuffled)) {
        return res.status(400).end();
      }

      await Promise.all(
        participants.map((participant, index) =>
          sql`UPDATE participants SET sorteado = ${shuffled[index].apelido} WHERE apelido = ${participant.apelido} AND event_id = ${event_id}`
        )
      );

      res.status(200).end();
    } catch (err) {
      console.log('Error shuffling participants', err);
      res.status(400).end();
    }
  }
}

function shuffleArray(array: Participant[]): Participant[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function hasSelfAssignment(original: Participant[], shuffled: Participant[]): boolean {
  return original.some((participant, index) => participant.apelido === shuffled[index].apelido);
}