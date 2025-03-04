const authGuard = require("./middleware/authguard");

const authRoutes = require("./routes/auth.routes");
const uploadRoutes = require("./routes/upload.routes");
const dataRoutes = require("./routes/data.routes");
const eventRoutes = require("./routes/event.route");
const extractoRoutes = require("./routes/extracto.route");
const dataExtrtactoRoutes = require("./routes/data_extracto.routes");
const cuentasRoutes = require("./routes/cuentas.routes");
const consolidadoRoutes = require("./routes/consolidado.routes");
const cuentasContablesRoutes = require("./routes/cuentas_contables.routes");
const provedoresRoutes = require("./routes/provedores.routes");
const facturasC = require("./routes/facturasC.routes");
const facturasdata = require("./routes/facturas_data.routes");
const masivo = require("./routes/masivo.routes");
const restablecer = require("./routes/forgot_password.routes");
const register = require("./routes/register.routes");
const users = require("./routes/users.routes");

module.exports = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api", restablecer);
  app.use("/api", register);
  app.use("/api", authGuard, uploadRoutes);
  app.use("/api/datos", authGuard, dataRoutes);
  app.use("/api/datos", authGuard, dataExtrtactoRoutes);
  app.use("/api", authGuard, eventRoutes);
  app.use("/api", authGuard, extractoRoutes);
  app.use("/api", authGuard, cuentasRoutes);
  app.use("/api", authGuard, consolidadoRoutes);
  app.use("/api", authGuard, cuentasContablesRoutes);
  app.use("/api", authGuard, provedoresRoutes);
  app.use("/api", authGuard, facturasC);
  app.use("/api", authGuard, facturasdata);
  app.use("/api", authGuard, masivo);
  app.use("/api", authGuard, users);
};
