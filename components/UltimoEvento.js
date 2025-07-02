import { useEffect, useRef, useState } from "react";

export default function UltimoEvento({ onMovimientoNuevo }) {
  const [evento, setEvento] = useState(null);
  const idAnteriorRef = useRef(null); // <- se mantiene entre renders

  useEffect(() => {
    const obtenerEvento = async () => {
      try {
        const res = await fetch("/api/ultimo-evento");
        const data = await res.json();

        if (data?.id !== idAnteriorRef.current && data.estado === "movimiento_detectado") {
          idAnteriorRef.current = data.id;
          onMovimientoNuevo?.(); // solo si es nuevo y es "movimiento_detectado"
        }

        setEvento(data);
      } catch (err) {
        console.error("❌ Error al obtener evento:", err);
      }
    };

    obtenerEvento(); // carga inicial
    const intervalo = setInterval(obtenerEvento, 10000); // cada 10 s

    return () => clearInterval(intervalo);
  }, [onMovimientoNuevo]);

  if (!evento) return <p className="text-center">🔄 Cargando estado actual...</p>;

  const detectado = evento.estado === "movimiento_detectado";

  return (
    <div className={`alert ${detectado ? "alert-danger" : "alert-success"} text-center`}>
      <h4>{detectado ? "Movimiento Detectado" : "Sin Movimiento"}</h4>
      <i
        className={`bi ${detectado ? "bi-exclamation-circle-fill text-danger" : "bi-check-circle-fill text-success"}`}
        style={{ fontSize: "3rem" }}
      ></i>
      <p className="mt-2">
        <strong>Última detección:</strong> {new Date(evento.fecha_hora).toLocaleString()}
      </p>
    </div>
  );
}
