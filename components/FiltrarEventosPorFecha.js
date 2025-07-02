import { useState, useEffect } from "react";

export default function FiltrarEventosPorFecha() {
  const [fecha, setFecha] = useState("");
  const [eventos, setEventos] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [paginaInput, setPaginaInput] = useState("1");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const limite = 15;

  const totalPaginas = Math.ceil(total / limite);

  const buscar = async (paginaActual = 1) => {
    if (!fecha) {
      setError("Por favor, selecciona una fecha.");
      return;
    }

    setError("");
    setCargando(true);
    try {
      const res = await fetch(`/api/eventos-por-fecha?fecha=${fecha}&pagina=${paginaActual}&limite=${limite}`);
      const data = await res.json();
      setEventos(data.eventos);
      setTotal(data.total);
      setPagina(paginaActual);
      setPaginaInput(paginaActual.toString());
    } catch (err) {
      console.error(err);
      setError("Error al buscar eventos.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="form-control"
        />
      </div>

      <div className="mb-3 text-center">
        <button className="btn btn-primary" onClick={() => buscar(1)} disabled={cargando}>
          {cargando ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {eventos.length > 0 && (
        <>
          <p className="text-center text-muted">
            Mostrando página {pagina} de {totalPaginas} ({total} registros)
          </p>
          <table className="table table-bordered table-hover mt-3">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Sensor</th>
                <th>Estado</th>
                <th>Fecha y Hora</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.sensor_id}</td>
                  <td>{e.estado}</td>
                  <td>{new Date(e.fecha_hora).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
            <div className="btn-group">
              <button
                className="btn btn-outline-secondary"
                onClick={() => buscar(pagina - 1)}
                disabled={pagina === 1 || cargando}
              >
                Anterior
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => buscar(pagina + 1)}
                disabled={pagina >= totalPaginas || cargando}
              >
                Siguiente
              </button>
            </div>

            <div className="input-group" style={{ maxWidth: "220px" }}>
              <input
                type="number"
                className="form-control"
                min={1}
                max={totalPaginas}
                value={paginaInput}
                onChange={(e) => setPaginaInput(e.target.value)}
              />
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  const num = parseInt(paginaInput);
                  if (!isNaN(num) && num >= 1 && num <= totalPaginas) {
                    buscar(num);
                  }
                }}
              >
                Ir
              </button>
            </div>
          </div>
        </>
      )}

      {!cargando && fecha && eventos.length === 0 && (
        <p className="text-center text-muted mt-3">No se encontraron eventos para esta fecha.</p>
      )}
    </div>
  );
}
