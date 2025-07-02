import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    const { fecha, pagina = 1, limite = 15 } = req.query;

    if (!fecha) {
      return res.status(400).json({ error: "Falta el parámetro 'fecha'." });
    }

    const page = parseInt(pagina);
    const limit = parseInt(limite);
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res.status(400).json({ error: "Parámetros de paginación inválidos." });
    }

    const inicio = new Date(`${fecha}T00:00:00-05:00`);
    if (isNaN(inicio.getTime())) {
      return res.status(400).json({ error: "Fecha inválida." });
    }

    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + 1);

    const skip = (page - 1) * limit;

    const [eventos, total] = await Promise.all([
      prisma.evento.findMany({
        where: {
          fecha_hora: { gte: inicio, lt: fin },
        },
        orderBy: { fecha_hora: "desc" },
        skip,
        take: limit,
      }),
      prisma.evento.count({
        where: {
          fecha_hora: { gte: inicio, lt: fin },
        },
      }),
    ]);

    return res.status(200).json({ eventos, total });
  } catch (error) {
    console.error("❌ Error en /api/eventos-por-fecha:", error);
    return res.status(500).json({ eventos: [], total: 0, error: "Error interno del servidor." });
  }
}
