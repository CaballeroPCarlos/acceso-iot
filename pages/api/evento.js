import prisma from "@/lib/prisma";

const ESTADOS_VALIDOS = ["movimiento_detectado", "sin_movimiento"];

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { sensor_id, estado } = req.body;

    if (!sensor_id?.trim() || !estado?.trim()) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    if (!ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({
        error: `Estado inválido. Solo se permiten: ${ESTADOS_VALIDOS.join(", ")}`,
      });
    }

    try {
      const nuevoEvento = await prisma.evento.create({
        data: { sensor_id, estado },
      });

      res.status(201).json(nuevoEvento);
    } catch (error) {
      console.error("❌ Error al crear evento:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: "Método no permitido" });
  }
}
