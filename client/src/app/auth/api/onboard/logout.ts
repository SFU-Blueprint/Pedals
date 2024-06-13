interface Response {
  status(code: number): Response;
  json(data: any): Response;
}

export default async function handler(req: any, res: Response) {
  res.status(200).json({ message: "Handler executed" });
}
