import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { empleadoId, fecha, pagina = 1 } = req.query;

  if (!empleadoId || !fecha) {
    return res.status(400).json({ error: "Faltan parámetros." });
  }

  // Día seleccionado en UTC-5 convertido a UTC
  const fechaBase = new Date(`${fecha}T05:00:00Z`);
  const inicioDiaUTC = new Date(fechaBase);
  const finDiaUTC = new Date(fechaBase);
  finDiaUTC.setUTCDate(finDiaUTC.getUTCDate() + 1);

  try {
    const contratos = await prisma.contrato.findMany({
      where: { empleadoId: parseInt(empleadoId) },
    });

    if (contratos.length === 0) {
      return res.status(200).json({ contratos: [], eventos: [], total: 0 });
    }

    // Obtener todos los eventos del día seleccionado
    const eventosDelDia = await prisma.evento.findMany({
      where: {
        fecha_hora: {
          gte: inicioDiaUTC,
          lt: finDiaUTC,
        },
      },
      orderBy: { fecha_hora: "desc" },
    });

    // Filtrar eventos cuya hora (ignorando fecha) esté dentro de alguna franja horaria de contrato
    const eventosFiltrados = eventosDelDia.filter(evt => {
      const hora = new Date(evt.fecha_hora);
      const minutosEvento = hora.getUTCHours() * 60 + hora.getUTCMinutes();

      return contratos.some(c => {
        const inicio = new Date(c.hora_inicio);
        const fin = new Date(c.hora_fin);

        const minInicio = inicio.getUTCHours() * 60 + inicio.getUTCMinutes();
        const minFin = fin.getUTCHours() * 60 + fin.getUTCMinutes();

        if (minFin <= minInicio) {
          // Cruza medianoche
          return minutosEvento >= minInicio || minutosEvento < minFin;
        } else {
          return minutosEvento >= minInicio && minutosEvento < minFin;
        }
      });
    });

    const total = eventosFiltrados.length;
    const skip = (parseInt(pagina) - 1) * 15;
    const eventosPaginados = eventosFiltrados.slice(skip, skip + 15);

    res.status(200).json({ contratos, eventos: eventosPaginados, total });
  } catch (error) {
    console.error("❌ Error en /api/historial:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
}
