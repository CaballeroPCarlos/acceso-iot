## 6. Notas de Despliegue y Entorno

---

**Entorno de ejecución recomendado:**

* **Node.js**: versión 18.x o superior.
* **Base de datos**: PostgreSQL (se espera que `DATABASE_URL` esté configurada en `.env`).
* **Zona horaria estándar**: el sistema opera internamente en UTC, pero ajusta horarios según la zona `America/Lima`.

**Pasos de despliegue:**

1. Instalar dependencias con `npm install`.
2. Configurar la base de datos en el archivo `.env`.
3. Ejecutar migraciones con `npx prisma migrate deploy`.
4. Generar cliente Prisma con `npx prisma generate`.
5. Iniciar el servidor con `npm run start`.

**Consideraciones adicionales:**

* **Desarrollo local**: usar `npm run dev`, que activa recarga automática.
* **Escalabilidad**: el diseño actual es modular, lo que facilita la extensión con nuevos sensores, validaciones o control de acceso por roles.
* **Seguridad pendiente**: actualmente, las rutas API no tienen autenticación. Se recomienda implementar un sistema de login con JWT o NextAuth para proteger operaciones sensibles.