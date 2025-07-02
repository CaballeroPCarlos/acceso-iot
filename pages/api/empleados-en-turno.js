import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    const ultimoEvento = await prisma.evento.findFirst({
      orderBy: { fecha_hora: "desc" },
    });

    if (!ultimoEvento) {
      return res.status(404).json({ error: "No hay eventos registrados." });
    }

    const fechaEvento = new Date(ultimoEvento.fecha_hora);
    const horaEvento = fechaEvento.getHours(); // ← Corregido
    const minutoEvento = fechaEvento.getMinutes(); // ← Corregido
    const totalMinutosEvento = horaEvento * 60 + minutoEvento;

    // Obtener todos los contratos
    const contratos = await prisma.contrato.findMany({
      include: { empleado: true },
    });

    // Filtrar por hora (ignorar fecha)
    const contratosActivos = contratos.filter((c) => {
      const inicio = new Date(c.hora_inicio);
      const fin = new Date(c.hora_fin);

      const minutosInicio = inicio.getHours() * 60 + inicio.getMinutes(); // ← Corregido
      const minutosFin = fin.getHours() * 60 + fin.getMinutes(); // ← Corregido

      if (minutosFin <= minutosInicio) {
        // Horario que cruza medianoche
        return (
          totalMinutosEvento >= minutosInicio || totalMinutosEvento < minutosFin
        );
      }

      return totalMinutosEvento >= minutosInicio && totalMinutosEvento < minutosFin;
    });

    const empleados = contratosActivos.map((c) => c.empleado);

    res.status(200).json({ empleados, fechaEvento });
  } catch (error) {
    console.error("❌ Error al obtener empleados en turno:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
}
