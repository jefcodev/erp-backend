const getMenuFrontend = (role) => {
  const menu = [];

  if (role === "Admin") {
    menu.push(
      {
        titulo: "Seguridad",
        icono: "mdi mdi-security",
        submenu: [
          { titulo: "Usuarios", url: "users" },
         /*  { titulo: "Roles", url: "roles" },
          { titulo: "Permisos", url: "" }, */
        ],
      },
      {
        titulo: "Contactos",
        icono: "mdi mdi-account-box",
        submenu: [
          { titulo: "Clientes", url: "clientes" },
          /* { titulo: "Grupos de Clientes", url: "" }, */
          { titulo: "Proveedores", url: "proveedores" },
        ],
      },
      {
        titulo: "Compras",
        icono: "mdi mdi-arrow-down-bold-circle-outline",
        submenu: [
          { titulo: "Proveedores", url: "proveedores" },
          { titulo: "Compras", url: "compras" },
          /* { titulo: "Orden de Compras", url: "" },
          { titulo: "Egresos", url: "" }, */
        ],
      },
      {
        titulo: "Ventas",
        icono: "mdi mdi-arrow-up-bold-circle-outline",
        submenu: [
          { titulo: "Clientes", url: "clientes" },
          { titulo: "Ventas", url: "ventas" },
         /*  { titulo: "Facturación Electrónica", url: "" }, */
          { titulo: "Proformas", url: "quotation" },
          { titulo: "Lista de Proformas", url: "quotations" },
         /*  { titulo: "Punto de Venta", url: "" },
          { titulo: "Ingresos", url: "" }, */
        ],
      },
      {
        titulo: "Inventario",
        icono: "mdi mdi-dropbox",
        submenu: [
          { titulo: "Productos", url: "productos" },
         /*  { titulo: "Configuración", url: "" }, */
          /* { titulo: "Tipos de Productos", url: "" },
          { titulo: "Lista de Precios", url: "" }, */
          { titulo: "Inventarios", url: "inventory/tipos" },
          { titulo: "Unidades Medidad", url: "inventory/units" },
          { titulo: "Marcas", url: "inventory/marcas" },
          { titulo: "Categorías", url: "inventory/categories" },
         /*  { titulo: "Sub Categorías", url: "" },
          { titulo: "Clasificaciones", url: "" }, */
        ],
      },
      {
        titulo: "APU",
        icono: "mdi mdi-file-document-box",
        submenu: [
          { titulo: "APU", url: "apu" },
          { titulo: "Lista de APU´s", url: "apus" },
          /* { titulo: "Configuración", url: "" }, */
        ],
      },
      {
        titulo: "Contabilidad",
        icono: "mdi mdi-calculator",
        submenu: [
          { titulo: "Asientos", url: "asientos" },
          { titulo: "Plan de Cuentas", url: "cuentas" },
          { titulo: "Formas de Pago", url: "formas-pago" },
          { titulo: "Tarifas IVA", url: "tarifas-iva" },
          { titulo: "Libro Diario", url: "libro-diario" },
          { titulo: "Libro Mayor", url: "libro-mayor" },
          { titulo: "Estado de Resultado", url: "estado-resultado" },
          { titulo: "Balance General", url: "balance-general" },
          { titulo: "Impuesto - IVA", url: "iva" },
          { titulo: "Impuesto - IR", url: "ir" },
        ],
      },
      {
        titulo: "Empleados",
        icono: "mdi mdi-account-multiple",
        submenu: [
          { titulo: "Lista", url: "" },
          { titulo: "Nómina", url: "" },
        ],
      },
      {
        titulo: "Reportes",
        icono: "mdi mdi-file-pdf",
        submenu: [
          { titulo: "Compras", url: "compras" },
          { titulo: "Ventas", url: "ventas" },
          { titulo: "Productos", url: "productos" },
          { titulo: "APUs", url: "apus" },
          { titulo: "Estado de Resultado", url: "estado-resultado" },
          { titulo: "Balance General", url: "balance-general" },
        ],
      },
      {
        titulo: "Configuración",
        icono: "mdi mdi-settings",
        submenu: [
          /* { titulo: "Información Tributaria", url: "" }, */
          { titulo: "Temas", url: "account-settings" },
          { titulo: "Perfil", url: "./perfil" },
          { titulo: "Idioma", url: "" },
          { titulo: "Notificación", url: "" },
          /* { titulo: "Privacidad", url: "" },
          { titulo: "", url: "" }, */
        ],
      }
    );
  }
  if (role === "Contador") {
    menu.push(
      {
        titulo: "Compras",
        icono: "mdi mdi-arrow-down-bold-circle-outline",
        submenu: [
          { titulo: "Proveedores", url: "proveedores" },
          { titulo: "Facturas Compra", url: "facturas" },
          { titulo: "Orden de Compras", url: "" },
          { titulo: "Egresos", url: "" },
        ],
      },
      {
        titulo: "Ventas",
        icono: "mdi mdi-arrow-up-bold-circle-outline",
        submenu: [
          { titulo: "Clientes", url: "clientes" },
          { titulo: "Facturas Venta", url: "facturas-ventas" },
          { titulo: "Facturación Electrónica", url: "" },
          { titulo: "Proformas", url: "quotation" },
          { titulo: "Punto de Venta", url: "" },
          { titulo: "Ingresos", url: "" },
        ],
      },
      {
        titulo: "Contabilidad",
        icono: "mdi mdi-calculator",
        submenu: [
          { titulo: "Asientos", url: "asientos" },
          { titulo: "Plan de Cuentas", url: "cuentas" },
          { titulo: "Formas de Pago", url: "formas-pago" },
          { titulo: "Tarifas IVA", url: "tarifas-iva" },
          { titulo: "Tarifas ICE", url: "" },
          { titulo: "Cuentas por Pagar", url: "" },
          { titulo: "Cuentas por Cobrar", url: "" },
          { titulo: "Libro Diario", url: "libro-diario" },
          { titulo: "Libro Mayor", url: "libro-mayor" },
          { titulo: "Estado de Resultado", url: "estado-resultado" },
          { titulo: "Balance General", url: "balance-general" },
          { titulo: "Impuestos", url: "" },
        ],
      }
    );
  }


  if (role === "Bodeguero") {
    menu.push(
      {
        titulo: "Compras",
        icono: "mdi mdi-arrow-down-bold-circle-outline",
        submenu: [
          /* { titulo: "Proveedores", url: "proveedores" }, */
          { titulo: "Compras", url: "compras" },
          /* { titulo: "Orden de Compras", url: "" },
          { titulo: "Egresos", url: "" }, */
        ],
      },
      {
        titulo: "Inventario",
        icono: "mdi mdi-dropbox",
        submenu: [
          { titulo: "Productos", url: "productos" },
         /*  { titulo: "Configuración", url: "" }, */
          /* { titulo: "Tipos de Productos", url: "" },
          { titulo: "Lista de Precios", url: "" }, */
          { titulo: "Inventarios", url: "inventory/tipos" },
          { titulo: "Unidades Medidad", url: "inventory/units" },
          { titulo: "Marcas", url: "inventory/marcas" },
          { titulo: "Categorías", url: "inventory/categories" },
         /*  { titulo: "Sub Categorías", url: "" },
          { titulo: "Clasificaciones", url: "" }, */
        ],
      }
    );
  }

  return menu;
};

module.exports = {
  getMenuFrontend,
};
