import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Historico() {
  const router = useRouter();
  const [empleados, setEmpleados] = useState([]);
  const [empleadoId, setEmpleadoId] = useState("");
  const [fecha, setFecha] = useState("");
  const [contratos, setContratos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [paginaInput, setPaginaInput] = useState("1");
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    fetch("/api/empleados")
      .then(res => res.json())
      .then(data => setEmpleados(Array.isArray(data) ? data : data.empleados || []));
  }, []);

  useEffect(() => {
    if (!empleadoId) return;
    fetch(`/api/contratos-por-empleado?id=${empleadoId}`)
      .then(res => res.json())
      .then(data => setContratos(data || []));
  }, [empleadoId]);

  const consultarHistorico = async () => {
    if (!empleadoId || !fecha) return;
    setCargando(true);
    const res = await fetch(`/api/historial?empleadoId=${empleadoId}&fecha=${fecha}&pagina=${pagina}`);
    const data = await res.json();
    setEventos(data.eventos || []);
    setTotal(data.total || 0);
    setCargando(false);
  };

  useEffect(() => {
    if (empleadoId && fecha) consultarHistorico();
  }, [pagina]);

  const totalPaginas = Math.ceil(total / 15);

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Histórico de Actividades</h3>

      <div className="mb-3 text-end">
        <button className="btn btn-secondary" onClick={() => router.push("/")}>
          ← Volver al inicio
        </button>
      </div>

      <div className="row mb-3">
        <div className="col-md-5">
          <select className="form-select" value={empleadoId} onChange={e => {
            setEmpleadoId(e.target.value);
            setPagina(1);
            setPaginaInput("1");
          }}>
            <option value="">Seleccionar empleado</option>
            {empleados.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.nombres} {emp.apellidos}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            value={fecha}
            onChange={e => {
              setFecha(e.target.value);
              setPagina(1);
              setPaginaInput("1");
            }}
          />
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary w-100" onClick={consultarHistorico}>
            Consultar
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <h5>Contratos del empleado:</h5>
          {contratos.length > 0 ? (
            <ul className="list-group">
              {contratos.map(c => (
                <li key={c.id} className="list-group-item">
                  {new Date(c.hora_inicio).toLocaleTimeString()} - {new Date(c.hora_fin).toLocaleTimeString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay contratos registrados.</p>
          )}
        </div>

        <div className="col-md-8">
          {cargando ? (
            <p className="text-center">Cargando eventos...</p>
          ) : (
            <>
              <p className="text-end">Total de eventos: {total}</p>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Estado</th>
                    <th>Fecha y hora</th>
                  </tr>
                </thead>
                <tbody>
                  {eventos.map((evt, idx) => (
                    <tr key={evt.id}>
                      <td>{(pagina - 1) * 15 + idx + 1}</td>
                      <td>{evt.estado}</td>
                      <td>{new Date(evt.fecha_hora).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {total > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                  <span>Página {pagina} de {totalPaginas}</span>

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
                          setPagina(num);
                        }
                      }}
                    >
                      Ir
                    </button>
                  </div>

                  <div className="btn-group">
                    <button
                      className="btn btn-outline-secondary"
                      disabled={pagina === 1}
                      onClick={() => {
                        const nueva = pagina - 1;
                        setPagina(nueva);
                        setPaginaInput(nueva.toString());
                      }}
                    >
                      Anterior
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      disabled={pagina === totalPaginas}
                      onClick={() => {
                        const nueva = pagina + 1;
                        setPagina(nueva);
                        setPaginaInput(nueva.toString());
                      }}
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <br />
      <br />
    </div>
  );
}
