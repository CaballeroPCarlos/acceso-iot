import Link from "next/link";

export default function Home() {
  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Sistema de Monitoreo</h1>
      <Link href="/zona" className="btn btn-primary btn-lg">
        Ver estado de la zona
      </Link>
    </div>
  );
}
