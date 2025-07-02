import { useState } from "react";

export default function RegistrarEmpleado({ onEmpleadoAgregado }) {
  const [form, setForm] = useState({ nombres: "", apellidos: "", dni: "" });
  const [mensaje, setMensaje] = useState("");

  const registrar = async () => {
    if (!form.nombres || !form.apellidos || !form.dni) {
      setMensaje("Completa todos los campos.");
      return;
    }

    try {
      const res = await fetch("/api/empleados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje("Empleado registrado exitosamente.");
        setForm({ nombres: "", apellidos: "", dni: "" });
        if (typeof onEmpleadoAgregado === "function") {
          onEmpleadoAgregado();
        }
      } else {
        setMensaje(data.error || "Error al registrar.");
      }
    } catch (error) {
      setMensaje("Error en el servidor.");
    }
  };

  return (
    <div className="card p-4">
      <h4 className="text-center mb-3">Registrar Empleado</h4>

      <div className="row align-items-center mb-3">
        <label className="col-md-2 col-form-label">Nombres:</label>
        <div className="col-md-10">
          <input
            className="form-control"
            value={form.nombres}
            onChange={(e) => setForm({ ...form, nombres: e.target.value })}
          />
        </div>
      </div>

      <div className="row align-items-center mb-3">
        <label className="col-md-2 col-form-label">Apellidos:</label>
        <div className="col-md-10">
          <input
            className="form-control"
            value={form.apellidos}
            onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
          />
        </div>
      </div>

      <div className="row align-items-center mb-4">
        <label className="col-md-2 col-form-label">DNI:</label>
        <div className="col-md-10">
          <input
            className="form-control"
            value={form.dni}
            onChange={(e) => setForm({ ...form, dni: e.target.value })}
          />
        </div>
      </div>

      <button className="btn btn-primary w-100" onClick={registrar}>
        Registrar
      </button>

      {mensaje && <p className="text-center mt-3">{mensaje}</p>}
    </div>
  );
}
