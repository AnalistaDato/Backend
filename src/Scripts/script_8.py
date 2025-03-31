import pandas as pd
from sqlalchemy.sql import text
from datetime import datetime
from db import get_engine


def update_fecha_reprogramacion(engine):
    today = datetime.today().strftime("%Y-%m-%d")

    # Comprobar si la columna 'fecha_reprogramacion' existe en la tabla 'facturas'
    query_check_column = """
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'facturas' AND column_name = 'fecha_reprogramacion'
    """
    column_exists = pd.read_sql(query_check_column, engine).shape[0] > 0

    if not column_exists:
        print("La columna 'fecha_reprogramacion' no existe en la tabla facturas.")
        return

    # Actualizar 'fecha_reprogramacion' en la tabla 'facturas' donde sea NULL o diferente a la fecha de hoy
    query_update_facturas = text(
        """
        UPDATE facturas
        SET fecha_reprogramacion = :today
        WHERE fecha_reprogramacion IS NULL OR fecha_reprogramacion != :today
    """
    )

    # Actualizar 'fecha_reprogramacion' en la tabla 'facturas_consolidadas' para los registros con estado 'proyectado' y fecha anterior a hoy
    query_update_facturas_consolidadas = text(
        """
        UPDATE facturas_consolidadas
        SET fecha_reprogramacion = :today
        WHERE estado = 'proyectado' AND fecha < :today
    """
    )

    # Ejecutar las consultas dentro de una transacción
    with engine.connect() as conn:
        transaction = conn.begin()
        try:
            # Ejecutar la actualización para la tabla 'facturas'
            conn.execute(query_update_facturas, {"today": today})

            # Ejecutar la actualización para la tabla 'facturas_consolidadas'
            conn.execute(query_update_facturas_consolidadas, {"today": today})

            # Confirmar la transacción
            transaction.commit()
            print(
                f"Columna 'fecha_reprogramacion' actualizada con la fecha {today} en 'facturas' y 'facturas_consolidadas'."
            )
        except Exception as e:
            transaction.rollback()
            print(f"Error al actualizar 'fecha_reprogramacion': {e}")


def main():
    print("=== Iniciando actualización de fecha_reprogramacion ===")
    engine = get_engine()

    try:
        engine.connect()
    except Exception as e:
        print(f"Error al conectar a la base de datos: {e}")
        return

    update_fecha_reprogramacion(engine)
    print("=== Script finalizado ===")


if __name__ == "__main__":
    main()
