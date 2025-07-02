## 5. Modelo de Datos

---

### `prisma/schema.prisma`

Define tres modelos principales utilizados por la aplicación:

* **`Evento`:** Registra cada detección del sensor, con un identificador, el ID del sensor (`sensor_id`), el estado (`estado`, puede ser `"movimiento_detectado"` o `"sin_movimiento"`), y la fecha y hora del evento (`fecha_hora`).

* **`Empleado`:** Contiene los datos personales del empleado (`nombres`, `apellidos`, `dni`) y un campo booleano (`huella_registrada`) para determinar si se ha registrado su huella. Se relaciona con el modelo `Contrato` en una relación uno a muchos.

* **`Contrato`:** Asocia a un empleado con una franja horaria (`hora_inicio` y `hora_fin`), representando su turno laboral. Cada contrato tiene una relación foránea con `Empleado`.

La base de datos utiliza PostgreSQL y se accede mediante la variable de entorno `DATABASE_URL`.