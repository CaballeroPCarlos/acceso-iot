import { obtenerEventosAntiguos } from "@/lib/eventoService";

export async function getServerSideProps() {
  const eventos = await obtenerEventosAntiguos();
  return {
    props: {
      eventos: JSON.parse(JSON.stringify(eventos)),
    },
  };
}

export default function Zona({ eventos }) {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Estado actual de la zona</h2>
      <table className="table table-bordered table-hover">
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
    </div>
  );
}
