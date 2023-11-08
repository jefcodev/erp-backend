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
app.use('/api/v1/productos', require('./routes/inventario/productos'));

// Purchase
app.use('/api/v1/purchase', require('./routes/purchase/purchases'));

// Compras
app.use('/api/v1/proveedores', require('./routes/compra/proveedores'));
app.use('/api/v1/facturas', require('./routes/compra/facturas'));
app.use('/api/v1/detalle-facturas', require('./routes/compra/detalle-facturas'));

// Ventas
app.use('/api/v1/clientes', require('./routes/venta/clientes'));
app.use('/api/v1/facturas-ventas', require('./routes/venta/facturas-ventas'));
app.use('/api/v1/detalle-facturas-ventas', require('./routes/venta/detalle-facturas-ventas'));

// Quoation
app.use('/api/v1/quotation', require('./routes/quotation/quotations'));

// APU
app.use('/api/v1/apu', require('./routes/apu/apus'));

// Contabilidad
app.use('/api/v1/cuentas', require('./routes/contabilidad/cuentas'));
app.use('/api/v1/formas-pago', require('./routes/contabilidad/formas-pago'));
app.use('/api/v1/tarifas-iva', require('./routes/contabilidad/tarifas-iva'));
app.use('/api/v1/asientos', require('./routes/contabilidad/asientos'));
app.use('/api/v1/detalle-asientos', require('./routes/contabilidad/detalle-asientos'));
app.use('/api/v1/libro-diario', require('./routes/contabilidad/libro-diario'));
app.use('/api/v1/libro-mayor', require('./routes/contabilidad/libro-mayor'));
app.use('/api/v1/balance-general', require('./routes/contabilidad/balance-general'));
app.use('/api/v1/estado-resultado', require('./routes/contabilidad/estado-resultado'));
app.use('/api/v1/estado-resultado', require('./routes/contabilidad/estado-resultado'));

// Busquedas
app.use('/api/v1/todo/', require('./routes/busquedas'));

app.listen(process.env.PORT, () => {
    console.log('Servidor ' + process.env.PORT)
})