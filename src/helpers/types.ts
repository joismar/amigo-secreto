export type Participant = {
  id: string;
  event_id: string;
  admin: boolean;
  email: string;
  apelido: string;
  sugestao: string;
  sorteado: string;
  pass: string;
}

export type Event = {
  id: string;
  name: string;
}