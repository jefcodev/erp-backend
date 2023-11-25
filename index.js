require('dotenv').config()

const express = require('express')
const cors = require('cors')

// Crear servidor express
const app = express();

// Configuración cors
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
});

// Core
app.use('/api/v1/login/', require('./routes/auth'));
    
// Usuarios 
app.use('/api/v1/roles/', require('./routes/seguridad/roles'));
app.use('/api/v1/usuarios', require('./routes/seguridad/usuarios'));
app.use('/api/v1/upload', require('./routes/uploads'));

// Inventory
app.use('/api/v1/inventory', require('./routes/inventory/inventory'));

// Inventario
app.use('/api/v1/inventario/productos', require('./routes/inventario/productos'));

// Purchase
app.use('/api/v1/purchase', require('./routes/purchase/purchases'));

// Compras
app.use('/api/v1/proveedores', require('./routes/compra/proveedores'));
app.use('/api/v1/compras', require('./routes/compra/compras'));
app.use('/api/v1/detalles-compras', require('./routes/compra/detalles-compras'));

// Ventas
app.use('/api/v1/clientes', require('./routes/venta/clientes'));
app.use('/api/v1/ventas', require('./routes/venta/ventas'));
app.use('/api/v1/detalles-ventas', require('./routes/venta/detalles-ventas'));

// Quoation
app.use('/api/v1/quotation', require('./routes/quotation/quotations'));

// APU
app.use('/api/v1/apu', require('./routes/apu/apus'));

// Contabilidad
app.use('/api/v1/contabilidad/cuentas', require('./routes/contabilidad/cuentas'));
app.use('/api/v1/contabilidad/tipos-comprobantes', require('./routes/contabilidad/tipos-comprobantes'));
app.use('/api/v1/contabilidad/pagos', require('./routes/contabilidad/pagos'));
app.use('/api/v1/contabilidad/formas-pago', require('./routes/contabilidad/formas-pago'));
app.use('/api/v1/contabilidad/tarifas-iva', require('./routes/contabilidad/tarifas-iva'));
app.use('/api/v1/contabilidad/asientos', require('./routes/contabilidad/asientos'));
app.use('/api/v1/contabilidad/detalle-asientos', require('./routes/contabilidad/detalle-asientos'));
app.use('/api/v1/contabilidad/libro-diario', require('./routes/contabilidad/libro-diario'));
app.use('/api/v1/contabilidad/libro-mayor', require('./routes/contabilidad/libro-mayor'));
app.use('/api/v1/contabilidad/balance-general', require('./routes/contabilidad/balance-general'));
app.use('/api/v1/contabilidad/estado-resultado', require('./routes/contabilidad/estado-resultado'));
app.use('/api/v1/contabilidad/iva', require('./routes/contabilidad/IVA'));

// Busquedas
app.use('/api/v1/todo/', require('./routes/busquedas'));

app.listen(process.env.PORT, () => {
    console.log('Servidor ' + process.env.PORT)
})