import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { sensor_id, estado } = req.body;

    if (!sensor_id || !estado) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
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
