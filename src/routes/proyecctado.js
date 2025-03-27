const express = require("express");
const router = express.Router();
const pool = require("../db");

// Función para formatear la fecha
function formatDate(date) {
    if (!date || date === "1969-12-31") return null;
  
    // Verificar si la fecha es válida antes de intentar formatearl
    const d = new Date(date);
  
    // Verificar si la conversión de la fecha fue exitosa
    if (isNaN(d.getTime())) {
      console.error("Fecha inválida:", date);
      return null; // Si la fecha no es válida, devolver null
    }
  
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  }
  
  

router.get("/proyecciones", async (req, res) => {
    try {
      const query = `
        SELECT 
          id,
          numero,
          nombre_socio,
          fecha_factura,
          fecha_vencimiento,
          total_en_divisa,
          importe_adeudado_sin_signo,
          estado_pago,
          estado,
          estado_g,
          fecha_reprogramacion,
          empresa
        FROM facturas 
        WHERE estado = 'proyectado'
      `;
  
      const [rows] = await pool.query(query);
  
      const formattedRows = rows.map((row) => ({
        ...row,
        fecha_factura: formatDate(row.fecha_factura),
        fecha_reprogramacion: formatDate(row.fecha_reprogramacion),
        fecha_vencimiento:formatDate(row.fecha_vencimiento),
      }));
  
      res.json(formattedRows);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error al obtener los datos");
    }
  });

  router.put("/proyecciones/:id/inactivate", async (req, res) => {
    const { id } = req.params;
  
    try {
      const query = `UPDATE facturas_consolidadas SET estado_g = 'I' WHERE id = ?`;
      const [result] = await pool.query(query, [id]);
  
      if (result.affectedRows > 0) {
        res.json({ message: "Factura inactivada correctamente" });
      } else {
        res.status(404).json({ message: "Factura no encontrada" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error al inactivar la factura");
    }
  });

  
module.exports = router;