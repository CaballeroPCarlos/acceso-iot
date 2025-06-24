import { useState } from "react";

export default function FiltrarEventosPorFecha() {
  const [fecha, setFecha] = useState("");
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const buscar = async () => {
    if (!fecha) {
      setError("Por favor, selecciona una fecha.");
      return;
    }

    setError("");
    setCargando(true);
    try {
      const res = await fetch(`/api/eventos-por-fecha?fecha=${fecha}`);
      const data = await res.json();
      setResultados(data);
    } catch (err) {
      setError("Error al buscar eventos.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <h3 className="text-center mb-3">Buscar eventos por fecha</h3>

      <div className="mb-3">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="mb-3 text-center">
        <button className="btn btn-primary" onClick={buscar} disabled={cargando}>
          {cargando ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {resultados.length > 0 ? (
        <table className="table table-bordered table-hover mt-4">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Sensor</th>
              <th>Estado</th>
              <th>Fecha y Hora</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.sensor_id}</td>
                <td>{e.estado}</td>
                <td>{new Date(e.fecha_hora).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !cargando && fecha && (
          <p className="text-center text-muted mt-3">No se encontraron eventos para esta fecha.</p>
        )
      )}
    </div>
  );
}
