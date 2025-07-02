## 4. Endpoints de la API

---

## 4.1 Empleados

---

### 📄 `pages/api/empleados.js`

**Descripción:**
Endpoint que permite listar todos los empleados con sus contratos asociados (`GET`) y registrar un nuevo empleado (`POST`). Maneja dos métodos HTTP con validaciones básicas.

---

#### ✅ `GET /api/empleados`

**Descripción:**
Retorna la lista completa de empleados, incluyendo sus contratos.

**Respuesta exitosa (`200 OK`):**

```json
[
  {
    "id": 1,
    "nombres": "Ana",
    "apellidos": "Gómez",
    "dni": "87654321",
    "huella_registrada": false,
    "contratos": [ ... ]
  },
  ...
]
```

**Errores posibles:**

* `500 Internal Server Error`: fallo al consultar la base de datos.

---

#### 📝 `POST /api/empleados`

**Descripción:**
Registra un nuevo empleado en la base de datos.

**Body esperado (JSON):**

```json
{
  "nombres": "Carlos",
  "apellidos": "Caballero",
  "dni": "12345678"
}
```

**Validaciones:**

* Todos los campos son obligatorios: `nombres`, `apellidos`, `dni`.

**Valores por defecto:**

* `huella_registrada` se inicializa como `false`.

**Respuesta exitosa (`201 Created`):**

```json
{
  "id": 4,
  "nombres": "Carlos",
  "apellidos": "Caballero",
  "dni": "12345678",
  "huella_registrada": false
}
```

**Errores posibles:**

* `400 Bad Request`: campos faltantes.
* `500 Internal Server Error`: error al registrar el nuevo empleado.

---

**Métodos permitidos:**

* `GET`, `POST`
  El resto devuelve `405 Method Not Allowed`.

**Dependencias:**

* Prisma: `empleado.findMany`, `empleado.create`
* Archivo local: `@/lib/prisma`

---

### 📄 `pages/api/empleados-en-turno.js`

**Descripción:**
Devuelve la lista de empleados que se encuentran en turno al momento del último evento registrado. Compara la hora del evento con los turnos (`hora_inicio` / `hora_fin`) definidos en los contratos, considerando también turnos nocturnos que cruzan medianoche.

**Método:** `GET`
**Ruta:** `/api/empleados-en-turno`

**Proceso:**

1. Obtiene el último evento desde `evento`, ordenado por `fecha_hora` descendente.
2. Extrae la hora y minuto del evento (`fechaEvento`), que representa la referencia horaria.
3. Obtiene todos los contratos con sus empleados asociados.
4. Compara la hora del evento con los horarios del contrato:

   * Si el contrato **no cruza la medianoche**, el evento debe estar dentro del intervalo `[inicio, fin)`.
   * Si el contrato **cruza la medianoche**, el evento debe estar después del inicio o antes del fin (con lógica circular).
5. Devuelve solo los empleados cuyos contratos coincidan con el horario calculado.

**Respuesta exitosa (`200 OK`):**

```json
{
  "empleados": [
    {
      "id": 3,
      "nombres": "Luis",
      "apellidos": "Ramírez",
      "dni": "12345678"
    },
    ...
  ],
  "fechaEvento": "2025-07-01T20:15:00.000Z"
}
```

**Errores posibles:**

* `404 Not Found`: si no hay eventos registrados.
* `500 Internal Server Error`: si ocurre una excepción al consultar la base de datos.

**Dependencias:**

* Prisma: `evento.findFirst`, `contrato.findMany({ include: { empleado: true } })`
* Archivo local: `@/lib/prisma`

**Uso típico:**

* Se consume desde el componente `EmpleadosEnTurno.js` para visualizar en tiempo real qué empleados están activos según el último evento.

---

## 4.2 Contratos

---

### 📄 `pages/api/contratos-por-empleado.js`

**Descripción:**
Endpoint API que permite obtener todos los contratos registrados para un empleado específico, ordenados por hora de inicio. Utiliza Prisma para consultar la base de datos.

**Método:** `GET`
**Ruta:** `/api/contratos-por-empleado?id={empleadoId}`

**Parámetros de consulta:**

* `id` (`number`): ID del empleado. Obligatorio.

**Validaciones:**

* Si `id` no existe o no es un número válido, responde con código `400` y un mensaje de error.

**Respuesta exitosa (`200 OK`):**

```json
[
  {
    "id": 1,
    "empleadoId": 3,
    "hora_inicio": "08:00",
    "hora_fin": "16:00"
  },
  ...
]
```

**Errores posibles:**

* `400 Bad Request`: si el ID es inválido.
* `500 Internal Server Error`: si ocurre un fallo al consultar la base de datos.

**Dependencias:**

* Prisma (`prisma.contrato.findMany`)
* Módulo local: `@/lib/prisma`

**Uso típico:**
Este endpoint es útil para:

* Visualizar o auditar los turnos asignados a un empleado.
* Aplicaciones que requieren listar contratos por trabajador (por ejemplo, módulos de historial o gestión).

---

### 📄 `pages/api/contratos.js`

**Descripción:**
Endpoint API para registrar un nuevo contrato de trabajo (turno) para un empleado. Solo acepta el método `POST` y realiza validaciones de datos, duración del turno y conversión de hora local (UTC-5) a UTC.

**Método:** `POST`
**Ruta:** `/api/contratos`

**Body esperado (JSON):**

```json
{
  "empleadoId": 3,
  "hora_inicio": "08:00",
  "hora_fin": "14:00"
}
```

**Validaciones realizadas:**

* Todos los campos (`empleadoId`, `hora_inicio`, `hora_fin`) deben estar presentes.
* El `empleadoId` debe ser numérico.
* Se construyen las fechas `inicioLocal` y `finLocal` con base en la hora de Lima (`America/Lima`).
* Si la hora de fin es menor o igual a la de inicio, se asume que el turno cruza la medianoche (turno nocturno).
* La duración debe ser entre 4 y 8 horas; si no, devuelve un `400`.

**Lógica horaria:**

* Usa `Intl.DateTimeFormat` con zona horaria `America/Lima` para obtener la fecha actual.
* Crea objetos `Date` locales con la hora enviada y la fecha actual.
* Prisma se encarga de guardar los `Date` como UTC automáticamente.

**Respuesta exitosa (`201 Created`):**

```json
{
  "id": 12,
  "empleadoId": 3,
  "hora_inicio": "2025-07-01T13:00:00.000Z",
  "hora_fin": "2025-07-01T17:00:00.000Z"
}
```

**Errores posibles:**

* `400 Bad Request`: datos faltantes, formato inválido, duración fuera del rango permitido.
* `405 Method Not Allowed`: si no se usa `POST`.
* `500 Internal Server Error`: si ocurre un fallo al guardar.

**Dependencias:**

* Prisma (`prisma.contrato.create`)
* Archivo local: `@/lib/prisma`

---

## 4.3 Eventos

---

### 📄 `pages/api/evento.js`

**Descripción:**
Registra un nuevo evento proveniente de un sensor, como "movimiento\_detectado" o "sin\_movimiento". Solo acepta solicitudes `POST`.

**Método:** `POST`
**Ruta:** `/api/evento`

---

#### 📥 Body esperado (JSON):

```json
{
  "sensor_id": "sensor_001",
  "estado": "movimiento_detectado"
}
```

**Validaciones:**

* `sensor_id` y `estado` son obligatorios (no pueden ser cadenas vacías).
* El `estado` debe ser uno de:

  * `"movimiento_detectado"`
  * `"sin_movimiento"`

---

#### ✅ Respuesta exitosa (`201 Created`):

```json
{
  "id": 23,
  "sensor_id": "sensor_001",
  "estado": "movimiento_detectado",
  "fecha_hora": "2025-07-02T04:50:00.000Z"
}
```

#### ❌ Errores posibles:

* `400 Bad Request`: por datos incompletos o estado inválido.
* `500 Internal Server Error`: error al registrar el evento.
* `405 Method Not Allowed`: si se intenta otro método HTTP.

---

**Dependencias:**

* Prisma: `evento.create`
* Archivo local: `@/lib/prisma`

**Uso típico:**
Este endpoint es consumido por dispositivos IoT o procesos automáticos que reportan actividad detectada por sensores.

---

### 📄 `pages/api/ultimo-evento.js`

**Descripción:**
Devuelve el evento más reciente registrado en la base de datos, ordenado por `fecha_hora`. Se utiliza para mostrar el estado actual del sistema de sensores.

**Método:** `GET`
**Ruta:** `/api/ultimo-evento`

---

#### ✅ Respuesta exitosa (`200 OK`):

```json
{
  "id": 105,
  "sensor_id": "sensor_001",
  "estado": "movimiento_detectado",
  "fecha_hora": "2025-07-02T04:55:00.000Z"
}
```

#### ❌ Errores posibles:

* No se implementa manejo explícito de errores. Si ocurre una falla interna en Prisma o en la conexión, puede responder con `500` implícito del entorno.

---

**Dependencias:**

* Prisma: `evento.findFirst`
* Archivo local: `@/lib/prisma`

**Uso típico:**
Este endpoint es consumido periódicamente (e.g. cada 10 segundos) por componentes como `UltimoEvento.js` para mantener una visualización actualizada del estado del sensor (con o sin movimiento).

---

### 📄 `pages/api/eventos-por-fecha.js`

**Descripción:**
Devuelve una lista paginada de eventos registrados durante una fecha dada (`YYYY-MM-DD`), ordenados por `fecha_hora` descendente. Se puede usar para reportes diarios y auditoría de sensores.

**Método:** `GET`
**Ruta:** `/api/eventos-por-fecha`

---

#### 📥 Parámetros de consulta (`query`):

| Parámetro | Tipo     | Obligatorio     | Descripción                       |
| --------- | -------- | --------------- | --------------------------------- |
| `fecha`   | `string` | ✅               | Fecha en formato `YYYY-MM-DD`     |
| `pagina`  | `number` | ❌ (default: 1)  | Página de resultados              |
| `limite`  | `number` | ❌ (default: 15) | Cantidad de resultados por página |

---

#### ✅ Respuesta exitosa (`200 OK`):

```json
{
  "eventos": [
    {
      "id": 12,
      "sensor_id": "sensor_001",
      "estado": "movimiento_detectado",
      "fecha_hora": "2025-07-01T20:45:00.000Z"
    },
    ...
  ],
  "total": 87
}
```

#### ❌ Errores posibles:

* `400 Bad Request`: si falta el parámetro `fecha` o hay valores inválidos en `pagina` o `limite`.
* `500 Internal Server Error`: error general al consultar la base de datos.

---

**Lógica de fecha:**

* La búsqueda se realiza entre `fecha T00:00:00` y `fecha T23:59:59` en zona horaria UTC-5 (Lima).
* Internamente se construyen objetos `Date` para definir el rango exacto del día.

---

**Dependencias:**

* Prisma: `evento.findMany`, `evento.count`
* Archivo local: `@/lib/prisma`

**Uso típico:**
Utilizado por interfaces como `FiltrarEventosPorFecha.js` para mostrar resultados filtrados y paginados por día.

---

### 📄 `pages/api/historial.js`

**Descripción:**
Devuelve los eventos registrados en una fecha específica que coincidan con los horarios de contrato de un empleado. Los resultados están paginados.

**Método:** `GET`
**Ruta:** `/api/historial`

---

#### 📥 Parámetros de consulta (`query`):

| Parámetro    | Tipo     | Obligatorio    | Descripción                          |
| ------------ | -------- | -------------- | ------------------------------------ |
| `empleadoId` | `number` | ✅              | ID del empleado                      |
| `fecha`      | `string` | ✅              | Fecha `YYYY-MM-DD`                   |
| `pagina`     | `number` | ❌ (default: 1) | Página de resultados (15 por página) |

---

#### 🔎 Lógica del filtro:

* La fecha proporcionada se interpreta como UTC-5 (`Lima`), luego se convierte a UTC para filtrar eventos por día.
* Se buscan **todos los contratos** del empleado.
* Luego se buscan **todos los eventos del día**.
* Solo se retienen los eventos cuya **hora (ignorando la fecha)** esté dentro de alguna franja horaria del contrato.

  * Si el contrato **cruza medianoche**, se considera la lógica circular.
* Se aplica paginación manual a los eventos filtrados (`15 por página`).

---

#### ✅ Respuesta exitosa (`200 OK`):

```json
{
  "contratos": [ { ... } ],
  "eventos": [ { ... } ],
  "total": 27
}
```

#### ❌ Errores posibles:

* `400 Bad Request`: si falta `empleadoId` o `fecha`.
* `500 Internal Server Error`: error en la consulta o en el filtrado.

---

**Dependencias:**

* Prisma: `contrato.findMany`, `evento.findMany`
* Archivo local: `@/lib/prisma`

**Uso típico:**
Se utiliza desde una interfaz de historial o reportes personalizados por empleado, por ejemplo, para revisar actividad detectada en su turno.