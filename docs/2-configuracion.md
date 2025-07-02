## 2. Configuración del Proyecto

---

## 2.1 Archivos de configuración

---

### `package.json`

Este archivo define metadatos y dependencias del proyecto:

* **Nombre del proyecto**: `acceso-iot`.
* **Scripts comunes**:

  * `"dev"`: ejecuta el entorno de desarrollo de Next.js.
  * `"build"`: genera el cliente Prisma, aplica migraciones y construye la app.
  * `"start"`: ejecuta el servidor de producción de Next.js.
  * `"lint"`: ejecuta el linter de Next.js.
* **Dependencias**:

  * `@prisma/client`: cliente de acceso a base de datos generado por Prisma.
  * `next`, `react`, `react-dom`: base del framework React + Next.js.
* **Dependencias de desarrollo**:

  * `prisma`: herramientas de línea de comandos para gestión del esquema y migraciones.

Este archivo permite instalar y ejecutar el proyecto fácilmente con `npm install` y `npm run dev`.

---

### 📁 `lib/prisma.js`

**Descripción:**
Archivo de configuración que expone una instancia única de `PrismaClient` para interactuar con la base de datos. Previene múltiples instancias en desarrollo, lo que evita errores de conexión repetida en entornos como Next.js (especialmente con recarga en caliente).

**Funcionamiento:**

* Crea una instancia de `PrismaClient`.
* En modo desarrollo (`NODE_ENV !== "production"`), la instancia se guarda en el objeto global (`global.prisma`) para evitar múltiples creaciones en recargas del servidor.
* Exporta la instancia `prisma` para ser usada en cualquier parte del backend (API Routes, lógica de servidor, etc.).

**Importancia técnica:**

* Este patrón es esencial en entornos **serverless** o de **recarga dinámica** (como Next.js), donde las funciones pueden reiniciarse frecuentemente.
* Mejora el rendimiento y la estabilidad de las conexiones a la base de datos.

**Uso típico:**
En rutas de API u otras funciones del servidor:

```js
import prisma from "@/lib/prisma";
const empleados = await prisma.empleado.findMany();
```

---

## 2.2 Estilos y documento base

---

### `styles/globals.css`

Contiene definiciones CSS básicas y globales para unificar el diseño de la interfaz. Incluye:

* Un fondo claro para el cuerpo (`body`) y una fuente moderna (`Segoe UI`).
* Clases auxiliares como `.mt-2` y `.mt-5` para márgenes verticales, usadas en distintas vistas para espaciado.
* `.text-center` para centrar texto.
* `.alert` estilizada con relleno y bordes redondeados, aplicada a componentes como `UltimoEvento`.

Estos estilos aseguran una apariencia visual uniforme en toda la aplicación.

---

### 📄 `pages/_document.js`

**Descripción:**
Sobrescribe el documento HTML base que Next.js genera por defecto. Se utiliza para insertar elementos personalizados en el `<head>` o modificar atributos globales del `<html>` o `<body>`.

**Características destacadas:**

* Define el atributo `lang="en"` en la etiqueta `<html>`.
* Incluye el CSS de **Bootstrap 5.3.2** directamente desde CDN:

  ```html
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
  ```
* Renderiza correctamente los componentes principales (`Main`, `NextScript`) necesarios para el funcionamiento de Next.js.

---

**Uso típico:**
Este archivo es ideal para agregar fuentes externas, estilos globales de bibliotecas como Bootstrap o enlaces a favicons y metadatos adicionales.