## 3. Interfaz de Usuario (Pages + Components)

---

## 3.1 Páginas

---

### `pages/index.js`

Vista inicial del sistema. Presenta un menú central con enlaces a las tres secciones principales del sistema:

* **Ver estado de la zona:** Redirige a `/zona`, donde se visualiza el último evento de movimiento.
* **Gestión de empleados:** Redirige a `/gestion`, donde se pueden registrar empleados y asignar contratos.
* **Historial de actividades:** Redirige a `/historico`, donde se consultan eventos por empleado y fecha.

---

### `pages/zona.js`

Esta vista permite visualizar el estado actual del sensor de movimiento y consultar eventos registrados por fecha. Contiene tres componentes principales:

* **`UltimoEvento`:** Muestra el último evento registrado (movimiento o sin movimiento).
* **`EmpleadosEnTurno`:** Lista a los empleados que, según los contratos, estaban activos al momento del último evento detectado.
* **`FiltrarEventosPorFecha`:** Permite consultar los eventos registrados en una fecha específica, con paginación.

Además, al detectar un nuevo movimiento, se actualiza automáticamente la lista de empleados en turno.

---

### 📄 `pages/gestion.js`

**Descripción:**
Página de gestión de empleados que permite registrar nuevos trabajadores o asignarles horarios mediante una interfaz dinámica.

**Componentes principales:**

* `RegistrarEmpleado`: formulario para registrar empleados.
* `GestionEmpleados`: permite asignar horarios y visualizar la lista.
* Ambos componentes se cargan de forma dinámica (`dynamic`) sin SSR (`ssr: false`), lo que evita errores por el uso de hooks/client-only en renderizado del servidor.

---

**Estado local:**

| Variable    | Función                                                                       |
| ----------- | ----------------------------------------------------------------------------- |
| `vista`     | Controla qué subcomponente se renderiza: `null`, `'registrar'` o `'listar'`.  |
| `refrescar` | Se utiliza como `flag` para forzar la recarga de datos en `GestionEmpleados`. |

---

**UI principal:**

* Botones para cambiar de vista (`Registrar`, `Ver empleados registrados`).
* Enlace con `Link` de Next.js para volver al inicio (`/`).

---

**Uso típico:**
Esta página es usada por un administrador del sistema para gestionar la nómina de empleados y asignar turnos laborales en función de sus horarios.

---

### `pages/historico.js` – Historial de Actividades

Esta vista permite consultar la actividad de un empleado para una fecha específica, mostrando los contratos vigentes ese día y los eventos detectados durante su horario laboral. Los datos se filtran y se muestran paginados.
Utiliza los endpoints: `/api/empleados`, `/api/contratos-por-empleado` y `/api/historial`.

---

## 3.2 Componentes

---

### 📁 `components/UltimoEvento.js`

**Descripción:**
Componente que muestra el estado del último evento registrado por sensores, consultando periódicamente el endpoint `/api/ultimo-evento`. Si detecta un nuevo evento con estado `"movimiento_detectado"`, dispara una notificación mediante la función `onMovimientoNuevo`.

**Funcionamiento:**

* Al montarse, realiza una primera consulta (`fetch`) al endpoint.
* Luego, cada 10 segundos repite la solicitud.
* Utiliza una referencia (`useRef`) para evitar que el mismo evento se notifique más de una vez.
* Si el evento es nuevo y su estado es `"movimiento_detectado"`, ejecuta el callback `onMovimientoNuevo`.

**Props:**

* `onMovimientoNuevo` (`function`, opcional): función ejecutada cuando se detecta un nuevo evento con movimiento.

**Estados y referencias:**

* `evento`: último evento obtenido desde el backend.
* `idAnteriorRef`: almacena el ID del último evento ya procesado (no se reinicia entre renders).

**Endpoint relacionado:**

* `GET /api/ultimo-evento`: retorna un objeto con al menos `{ id, estado, fecha_hora }`.

**Interfaz de usuario:**

* Muestra un cuadro con estilos diferenciados (`alert-success` o `alert-danger`) según el estado del evento.
* Incluye íconos de Bootstrap Icons (`bi-check-circle-fill`, `bi-exclamation-circle-fill`).
* Indica la hora de la última detección en formato local (`toLocaleString`).

---

### 📁 `components/EmpleadosEnTurno.js`

**Descripción:**
Componente React que muestra la lista de empleados actualmente en turno. Se comunica con una API interna (`/api/empleados-en-turno`) para obtener los datos y renderiza la información de forma reactiva.

**Props:**

* `recargar` (`boolean`): Indica si se debe realizar una nueva solicitud al backend.
* `onRecargado` (`function`, opcional): Callback que se ejecuta una vez concluida la carga de datos.

**Funcionamiento:**

* Usa `useEffect` para disparar la solicitud `fetch` cuando la prop `recargar` cambia.
* Muestra mensajes condicionales mientras los datos están cargando, si no hay resultados o cuando se recibe la lista.
* Maneja errores en la consola sin interrumpir la experiencia del usuario.

**Dependencias:**

* React (`useState`, `useEffect`)

**Endpoint relacionado:**

* `GET /api/empleados-en-turno`: Se espera que retorne un objeto con `empleados` (array de objetos `{ id, nombres, apellidos }`) y `fechaEvento` (timestamp o string ISO).

---

### 📁 `components/FiltrarEventosPorFecha.js`

**Descripción:**
Componente React que permite filtrar y paginar eventos registrados en una fecha específica. Se conecta al endpoint `/api/eventos-por-fecha` mediante parámetros `fecha`, `pagina` y `limite`, y muestra los resultados en una tabla interactiva.

**Funcionamiento:**

* Utiliza `useState` para manejar fecha seleccionada, resultados (`eventos`), paginación (`pagina`, `total`, `paginaInput`) y estados de carga o error.
* La búsqueda se inicia manualmente al hacer clic en "Buscar", o al navegar por páginas.
* Muestra una tabla con los resultados paginados, junto a controles para avanzar/retroceder o ir a una página específica.

**Variables importantes:**

* `fecha`: Fecha seleccionada para la consulta (formato `yyyy-mm-dd`)
* `limite`: Número fijo de resultados por página (15)
* `total`: Total de registros devueltos por la API
* `totalPaginas`: Calculado automáticamente (`Math.ceil(total / limite)`)

**Endpoint relacionado:**

* `GET /api/eventos-por-fecha?fecha={fecha}&pagina={n}&limite=15`
  Se espera que retorne:

  ```json
  {
    "eventos": [ { "id": 1, "sensor_id": "...", "estado": "...", "fecha_hora": "..." }, ... ],
    "total": 42
  }
  ```

**Mensajes de interfaz:**

* Muestra errores si no se selecciona una fecha o si la API falla.
* Informa cuántos registros se encontraron y en qué página se está.
* Muestra mensaje personalizado cuando no hay resultados para la fecha seleccionada.

---

### 📁 `components/GestionEmpleados.js`

**Descripción:**
Componente de interfaz para asignar horarios de trabajo a empleados registrados. Permite seleccionar un empleado de una lista y establecer su `hora_inicio` y `hora_fin`, validando el formato y enviando la información a través de una solicitud POST.

**Funcionamiento:**

* Al montar el componente, se realiza un `fetch` a `/api/empleados` para poblar la lista de empleados.
* El formulario permite seleccionar un empleado y definir su horario en formato `HH:mm`.
* Al hacer clic en **"Asignar horario"**, se valida el formulario y se envía una solicitud a `/api/contratos`.

**Validaciones aplicadas:**

* Todos los campos deben estar completos.
* Las horas deben cumplir con el patrón de 24 horas (`HH:mm`).

**Estados locales:**

* `empleados`: array de empleados recuperados.
* `form`: objeto que contiene los datos del formulario.
* `mensaje`: feedback textual para el usuario.
* `cargando`: bandera para el estado de carga inicial de empleados.

**Endpoints relacionados:**

* `GET /api/empleados`: devuelve una lista de empleados (`{ id, nombres, apellidos }`)
* `POST /api/contratos`: espera un JSON con `empleadoId`, `hora_inicio`, `hora_fin`; responde con éxito o mensaje de error.

**Interfaz de usuario:**

* Diseño en formato de tarjeta con campos tipo `select` e `input` de tiempo.
* Muestra mensajes informativos según éxito o error de la operación.

---

### 📁 `components/RegistrarEmpleado.js`

**Descripción:**
Componente de formulario para registrar nuevos empleados. Captura `nombres`, `apellidos` y `dni`, y envía los datos al backend mediante una solicitud `POST` a `/api/empleados`.

**Funcionamiento:**

* El formulario utiliza un estado controlado (`form`) para almacenar los datos del nuevo empleado.
* Al hacer clic en **"Registrar"**, se validan los campos obligatorios.
* Si la solicitud es exitosa, se limpia el formulario y se muestra un mensaje de confirmación.
* Se ejecuta el callback `onEmpleadoAgregado` si es proporcionado, permitiendo a otros componentes actualizarse tras el registro.

**Props:**

* `onEmpleadoAgregado` (`function`, opcional): función que se ejecuta después del registro exitoso.

**Validaciones:**

* Todos los campos (`nombres`, `apellidos`, `dni`) deben estar completos antes de enviar.
* No se incluye validación de formato para el DNI, lo cual podría añadirse posteriormente.

**Endpoint relacionado:**

* `POST /api/empleados`: espera un JSON con `{ nombres, apellidos, dni }`.
  Responde con un mensaje de éxito o error (por ejemplo, si el DNI está duplicado).

**Estados locales:**

* `form`: datos del formulario.
* `mensaje`: respuesta o error mostrado al usuario.

**Interfaz de usuario:**

* Formulario dividido en filas por campo, con controles `input` y un botón principal.
* Estilo envolvente con clase `card` para mantener coherencia visual con otros módulos.