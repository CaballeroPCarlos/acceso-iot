import { useEffect, useState } from "react";

export default function GestionEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [form, setForm] = useState({ empleadoId: "", hora_inicio: "", hora_fin: "" });
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  const obtenerEmpleados = async () => {
    try {
      const res = await fetch("/api/empleados");
      const data = await res.json();
      setEmpleados(Array.isArray(data) ? data : data.empleados || []);
    } catch (err) {
      console.error("Error al obtener empleados:", err);
      setEmpleados([]);
    } finally {
      setCargando(false);
    }
  };

  const asignarContrato = async () => {
    if (!form.empleadoId || !form.hora_inicio || !form.hora_fin) {
      setMensaje("Completa todos los campos.");
      return;
    }

    const formatoHora = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!form.hora_inicio.match(formatoHora) || !form.hora_fin.match(formatoHora)) {
      setMensaje("Las horas deben estar en formato HH:mm.");
      return;
    }

    try {
      const res = await fetch("/api/contratos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empleadoId: form.empleadoId,
          hora_inicio: form.hora_inicio,
          hora_fin: form.hora_fin,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje("Horario asignado correctamente.");
        setForm({ ...form, hora_inicio: "", hora_fin: "" });
      } else {
        setMensaje(data.error || "Error al asignar horario.");
      }
    } catch (error) {
      setMensaje("Error en el servidor.");
    }
  };

  return (
    <div className="card p-4">
      <h4 className="text-center mb-4">Gestión de Empleados</h4>
      <h5>Asignar horario (UTC-5)</h5>

      <div className="row align-items-center mb-3">
        <label className="col-md-2 col-form-label">Empleado:</label>
        <div className="col-md-10">
          <select
            className="form-select"
            value={form.empleadoId}
            onChange={(e) => setForm({ ...form, empleadoId: e.target.value })}
          >
            <option value="">Seleccionar empleado</option>
            {empleados.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombres} {e.apellidos}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row align-items-center mb-3">
        <label className="col-md-2 col-form-label">hora_inicio:</label>
        <div className="col-md-10">
          <input
            type="time"
            className="form-control"
            value={form.hora_inicio}
            onChange={(e) => setForm({ ...form, hora_inicio: e.target.value })}
          />
        </div>
      </div>

      <div className="row align-items-center mb-4">
        <label className="col-md-2 col-form-label">hora_fin:</label>
        <div className="col-md-10">
          <input
            type="time"
            className="form-control"
            value={form.hora_fin}
            onChange={(e) => setForm({ ...form, hora_fin: e.target.value })}
          />
        </div>
      </div>

      <button className="btn btn-success w-100" onClick={asignarContrato}>
        Asignar horario
      </button>

      {mensaje && <p className="text-center mt-3">{mensaje}</p>}
    </div>
  );
}
