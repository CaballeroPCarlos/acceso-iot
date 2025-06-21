-- CreateTable
CREATE TABLE "Evento" (
    "id" SERIAL NOT NULL,
    "sensor_id" TEXT NOT NULL DEFAULT 'PIR01',
    "estado" TEXT NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);
