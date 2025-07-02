export default async function handler(req, res) {
  const { fecha, pagina = 1, limite = 15 } = req.query;

  if (!fecha) {
    return res.status(400).json({ error: "Falta el parámetro 'fecha'." });
  }

  const desfaseHoras = 5;
  const inicio = new Date(`${fecha}T00:00:00-05:00`);
  const fin = new Date(inicio);
  fin.setDate(fin.getDate() + 1);

  const skip = (parseInt(pagina) - 1) * parseInt(limite);

  try {
    const [eventos, total] = await Promise.all([
      prisma.evento.findMany({
        where: {
          fecha_hora: { gte: inicio, lt: fin },
        },
        orderBy: { fecha_hora: "desc" },
        skip,
        take: parseInt(limite),
      }),
      prisma.evento.count({
        where: {
          fecha_hora: { gte: inicio, lt: fin },
        },
      }),
    ]);

    res.status(200).json({ eventos, total });
  } catch (error) {
    console.error("Error al consultar eventos:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
}
