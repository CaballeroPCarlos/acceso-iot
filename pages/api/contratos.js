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
    // Obtener fecha actual en Lima (UTC-5)
    const ahora = new Date();
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Lima",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(ahora).reduce((acc, part) => {
      if (part.type !== "literal") acc[part.type] = part.value;
      return acc;
    }, {});

    const anio = parseInt(parts.year);
    const mes = parseInt(parts.month) - 1;
    const dia = parseInt(parts.day);

    // Construir fechas locales (hora Lima)
    const [hIni, mIni] = hora_inicio.split(":").map(Number);
    const [hFin, mFin] = hora_fin.split(":").map(Number);

    let inicioLocal = new Date(anio, mes, dia, hIni, mIni);
    let finLocal = new Date(anio, mes, dia, hFin, mFin);

    if (finLocal <= inicioLocal) {
      finLocal.setDate(finLocal.getDate() + 1);
    }

    // No sumar desfase manual: Prisma guarda en UTC automáticamente
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
