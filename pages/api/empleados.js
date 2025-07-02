import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const empleados = await prisma.empleado.findMany({
        include: { contratos: true },
      });
      return res.status(200).json(empleados);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }

  if (req.method === "POST") {
    const { nombres, apellidos, dni } = req.body;

    if (!nombres || !apellidos || !dni) {
      return res.status(400).json({ error: "Faltan datos requeridos." });
    }

    try {
      const empleado = await prisma.empleado.create({
        data: {
          nombres,
          apellidos,
          dni,
          huella_registrada: false,
        },
      });

      return res.status(201).json(empleado);
    } catch (error) {
      console.error("Error al registrar empleado:", error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }

  // Si no es GET ni POST
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Método no permitido." });
}
