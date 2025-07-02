import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "ID de empleado inválido." });
  }

  try {
    const contratos = await prisma.contrato.findMany({
      where: { empleadoId: parseInt(id) },
      orderBy: { hora_inicio: "asc" },
    });

    res.status(200).json(contratos);
  } catch (error) {
    console.error("❌ Error al obtener contratos:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
}
