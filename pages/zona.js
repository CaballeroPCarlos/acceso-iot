import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

const UltimoEvento = dynamic(() => import("@/components/UltimoEvento"), { ssr: false });
const FiltrarEventosPorFecha = dynamic(() => import("@/components/FiltrarEventosPorFecha"), { ssr: false });
const EmpleadosEnTurno = dynamic(() => import("@/components/EmpleadosEnTurno"), { ssr: false });

export default function Zona() {
  const [recargarEmpleados, setRecargarEmpleados] = useState(false);

  const handleMovimientoDetectado = () => {
    // Cambia el estado a true para que EmpleadosEnTurno se recargue
    setRecargarEmpleados(true);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Panel de Monitoreo</h2>

      <div className="row">
        <div className="col-md-6 mb-4">
          <h4 className="text-center mb-3">Estado Actual</h4>
          <UltimoEvento onMovimientoNuevo={handleMovimientoDetectado} />
          <EmpleadosEnTurno recargar={recargarEmpleados} onRecargado={() => setRecargarEmpleados(false)} />
          <div className="text-center mt-4">
            <Link href="/" legacyBehavior>
              <a className="btn btn-secondary">Volver al inicio</a>
            </Link>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <h4 className="text-center mb-3">Buscar eventos por fecha</h4>
          <FiltrarEventosPorFecha />
        </div>
      </div>
    </div>
  );
}
