# 📘 Manual de Usuario – Sistema de Monitoreo y Gestión de Empleados

## 📌 Descripción General

Este sistema permite registrar empleados, asignarles turnos laborales, y monitorear eventos captados por sensores de movimiento. Es ideal para controlar acceso o supervisar actividad en instalaciones físicas.

---

## 🧭 Navegación Principal

Al ingresar al sistema, encontrarás tres secciones:

- **Ver estado de la zona:** Muestra el último evento registrado por los sensores.
- **Gestión de empleados:** Permite registrar nuevos empleados y asignarles turnos.
- **Historial de actividades:** Consulta eventos pasados filtrados por fecha y empleado.

---

## 👤 Gestión de Empleados

### ➕ Registrar Empleado

1. Dirígete a **Gestión de empleados**.
2. Haz clic en el botón **Registrar**.
3. Completa los campos: Nombres, Apellidos y DNI.
4. Presiona **Registrar**. Si todo es correcto, verás un mensaje de confirmación.

### 🕒 Asignar Horario

1. En **Gestión de empleados**, haz clic en **Ver empleados registrados**.
2. Selecciona un empleado.
3. Define la hora de inicio y fin del turno (formato `HH:mm`).
4. Presiona **Asignar horario**.
   - El sistema valida que el turno dure entre 4 y 8 horas.
   - Si el turno cruza medianoche, se ajusta automáticamente.

---

## 🔍 Monitoreo de Zona

### Estado Actual

- Muestra si se ha detectado movimiento.
- Indica la **fecha y hora del último evento** registrado.

### Empleados en Turno

- Lista a los empleados que tenían turno activo al momento del último evento.
- Se actualiza automáticamente cada vez que se detecta movimiento.

---

## 📅 Consulta de Historial

1. Ingresa a la sección **Historial de actividades**.
2. Selecciona un empleado y una fecha específica.
3. Presiona **Buscar**.
4. El sistema mostrará:
   - Contratos activos ese día.
   - Eventos registrados durante el horario laboral del empleado.

---

## ✅ Recomendaciones

- Asegúrate de registrar correctamente los turnos en hora local (Lima – UTC-5).
- Verifica que el sistema mantenga comunicación con los sensores.
- Consulta regularmente el historial para supervisión y auditoría.

---