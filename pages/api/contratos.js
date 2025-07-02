import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Método no permitido." });
  }

  const { empleadoId, hora_inicio, hora_fin } = req.body;

  if (!empleadoId || !hora_inicio || !hora_fin) {
    return res.status(400).json({ error: "Datos incompletos." });
  }

  const empleadoIdInt = parseInt(empleadoId);
  if (isNaN(empleadoIdInt)) {
    return res.status(400).json({ error: "ID de empleado inválido." });
  }

  try {
    // Obtener la fecha actual en Lima (formato ISO)
    const fechaActualLima = new Date().toLocaleDateString("en-CA", {
      timeZone: "America/Lima",
    }); // formato "YYYY-MM-DD"

    // Combinar fecha con hora y zona horaria -05:00
    const inicioStr = `${fechaActualLima}T${hora_inicio}:00-05:00`;
    const finStr = `${fechaActualLima}T${hora_fin}:00-05:00`;

    let inicioLocal = new Date(inicioStr);
    let finLocal = new Date(finStr);

    // Si el turno cruza la medianoche
    if (finLocal <= inicioLocal) {
      finLocal.setDate(finLocal.getDate() + 1);
    }

    const duracionHoras = (finLocal - inicioLocal) / (1000 * 60 * 60);
    if (duracionHoras < 4 || duracionHoras > 8) {
      return res.status(400).json({
        error: "El contrato debe tener entre 4 y 8 horas de duración.",
      });
    }

    const contrato = await prisma.contrato.create({
      data: {
        empleadoId: empleadoIdInt,
        hora_inicio: inicioLocal,
        hora_fin: finLocal,
      },
    });

    return res.status(201).json(contrato);
  } catch (error) {
    console.error("Error al registrar contrato:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
}
