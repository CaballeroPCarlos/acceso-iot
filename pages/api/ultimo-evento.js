// pages/api/ultimo-evento.js
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const evento = await prisma.evento.findFirst({
    orderBy: { fecha_hora: "desc" },
  });
  res.status(200).json(evento);
}
