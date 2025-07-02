# Proyecto Next.js + Prisma (con PostgreSQL)

Este proyecto contiene una configuración base para iniciar un desarrollo web moderno utilizando **Next.js** y **Prisma** como ORM para bases de datos (probado con Neon Postgres).

---

## 🚀 Configuración Inicial

### 1. Crear un nuevo proyecto Next.js

1. Abre PowerShell (Shift + clic derecho → "Abrir PowerShell aquí")
2. Instala Node.js desde: https://nodejs.org/es → Descargar el instalador `.msi`
3. Habilita la ejecución de scripts si es necesario:

   ```bash
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

4. Crea tu proyecto:

   ```bash
   npx create-next-app@latest next-vacio
   ```

   * Reemplaza `next-vacio` con el nombre de tu proyecto.
   * Presiona `y` para confirmar.
   * Selecciona **"No" en todas las opciones** si deseas un proyecto limpio.

5. Ingresa a la carpeta del proyecto:

   ```bash
   cd next-vacio
   ```

6. Si clonaste el proyecto desde GitHub:

   ```bash
   npm install
   ```

7. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abre tu navegador: `http://localhost:3000`

---

## 🧼 Limpieza Inicial (opcional)

Elimina archivos innecesarios si quieres un proyecto más limpio:

* `public/next.svg`
* `public/vercel.svg`
* `styles/Home.module.css`

---

## 🖌️ Archivos Clave

* `styles/globals.css`: define los estilos globales.
* `pages/index.js`: tu página principal (puede dejarse minimalista solo con el 'Home()').
* `_document.js`: modifica el `<head>` del HTML; útil para agregar Bootstrap u otros estilos externos.

---

## 🛢️ Uso de Base de Datos con Prisma

1. Instala Prisma:

   ```bash
   npm install prisma --save-dev
   npx prisma init
   npm install @prisma/client
   ```

   Esto generará:

   * `.env` → contiene la variable `DATABASE_URL`
   * `prisma/schema.prisma` → define tu modelo de datos

2. Configura `schema.prisma`:

   ```prisma
   generator client {
     provider = "prisma-client-js"
   }

   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   model Persona {
     id     Int    @id @default(autoincrement())
     nombre String
     edad   Int
   }
   ```

3. En el archivo `.env`, reemplaza el valor de `DATABASE_URL` por la cadena de conexión de tu base de datos.

---

## 🔧 Script de build para Vercel

En `package.json`, asegúrate de tener este script para despliegue:

```json
"scripts": {
  "build": "prisma generate && prisma migrate deploy && next build"
}
```

---

## 🛠️ Migraciones

* Crear tablas en la base de datos (son los 'model's creados en `schema.prisma`):

   ```bash
   npx prisma migrate dev --name init
   ```

* Cada vez que modifiques el esquema, ejecuta:

   ```bash
   npx prisma generate
   ```

---

✅ Con estos pasos, tu entorno estará listo para comenzar a desarrollar una app moderna con Next.js y una base de datos conectada mediante Prisma.
