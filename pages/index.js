import Link from "next/link";

export default function Home() {
  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Sistema de Monitoreo</h1>
      
      <div className="d-grid gap-3 col-6 mx-auto">
        <Link href="/zona" className="btn btn-primary btn-lg">
          Ver estado de la zona
        </Link>

        <Link href="/gestion" className="btn btn-outline-secondary btn-lg">
          Gestión de empleados
        </Link>

        <Link href="/historico" className="btn btn-outline-info btn-lg">
          Historial de actividades
        </Link>
      </div>
    </div>
  );
}
