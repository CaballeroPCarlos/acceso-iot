import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { fecha } = req.query;

  if (!fecha) {
    return res.status(400).json({ error: "Falta el parámetro 'fecha'." });
  }

  // Interpretar la fecha como si fuera en UTC-5
  const desfaseHoras = 5; // Perú = UTC-5
  const inicio = new Date(`${fecha}T00:00:00-05:00`);
  const fin = new Date(inicio);
  fin.setDate(fin.getDate() + 1);

  try {
    const eventos = await prisma.evento.findMany({
      where: {
        fecha_hora: {
          gte: inicio,
          lt: fin,
        },
      },
      orderBy: { fecha_hora: "desc" },
    });

    res.status(200).json(eventos);
  } catch (error) {
    console.error("Error al consultar eventos:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
}
