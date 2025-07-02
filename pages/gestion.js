import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link"; // Importar Link

const RegistrarEmpleado = dynamic(() => import("@/components/RegistrarEmpleado"), { ssr: false });
const GestionEmpleados = dynamic(() => import("@/components/GestionEmpleados"), { ssr: false });

export default function Gestion() {
  const [vista, setVista] = useState(null); // null | 'registrar' | 'listar'
  const [refrescar, setRefrescar] = useState(false);

  const actualizarEmpleados = () => {
    setRefrescar((prev) => !prev);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Gestión de Empleados</h2>

      <div className="text-center mb-4">
        <button className="btn btn-primary me-2" onClick={() => setVista("registrar")}>
          Registrar empleado
        </button>
        <button className="btn btn-secondary me-2" onClick={() => setVista("listar")}>
          Ver empleados registrados
        </button>
        <Link href="/" legacyBehavior>
          <a className="btn btn-outline-dark">Volver al inicio</a>
        </Link>
      </div>

      {vista === "registrar" && (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <RegistrarEmpleado onEmpleadoAgregado={actualizarEmpleados} />
          </div>
        </div>
      )}

      {vista === "listar" && (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <GestionEmpleados refrescar={refrescar} />
          </div>
        </div>
      )}
    </div>
  );
}
