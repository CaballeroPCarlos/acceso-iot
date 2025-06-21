// lib/eventoService.js
import prisma from "./prisma.js";

export async function obtenerEventosAntiguos(limit = 20) {
  const eventos = await prisma.evento.findMany({
    orderBy: { fecha_hora: "desc" },
    take: limit,
  });
  return eventos;
}
