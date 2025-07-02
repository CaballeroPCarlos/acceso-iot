import { useEffect, useState } from "react";

export default function EmpleadosEnTurno({ recargar, onRecargado }) {
  const [empleados, setEmpleados] = useState([]);
  const [fechaEvento, setFechaEvento] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!recargar) return;

    const obtener = async () => {
      setCargando(true);
      try {
        const res = await fetch("/api/empleados-en-turno");
        const data = await res.json();
        setEmpleados(data.empleados || []);
        setFechaEvento(data.fechaEvento || null);
      } catch (err) {
        console.error("Error al obtener empleados en turno:", err);
      } finally {
        setCargando(false);
        onRecargado?.();
      }
    };

    obtener();
  }, [recargar, onRecargado]);

  return (
    <div className="mt-4">
      <h5 className="text-center">Empleados en turno</h5>

      {cargando ? (
        <p className="text-center text-primary">🔄 Actualizando lista de empleados...</p>
      ) : empleados.length > 0 ? (
        <ul className="list-group">
          {empleados.map((emp) => (
            <li key={emp.id} className="list-group-item text-center">
              {emp.nombres} {emp.apellidos}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-muted">No hay empleados en turno.</p>
      )}
    </div>
  );
}
