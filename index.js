require('dotenv').config()

const express = require('express')
const cors = require('cors')


// crear servidor express
const app = express();

// configuración cors
app.use(cors());

//Lectura y parse del body
app.use(express.json());


// core
app.use('/api/v1/login/', require('./routes/auth'));
    //usuarios 
app.use('/api/v1/roles/', require('./routes/seguridad/roles'));
app.use('/api/v1/usuarios', require('./routes/seguridad/usuarios'));
app.use('/api/v1/upload', require('./routes/uploads'));

//Inventory
app.use('/api/v1/inventory', require('./routes/inventory/inventory'));

//Purchase
app.use('/api/v1/purchase', require('./routes/purchase/purchases'));
// Compras
app.use('/api/v1/proveedores', require('./routes/compra/proveedores'));
//app.use('/api/v1/facturas', require('./routes/compra/facturas'));
//app.use('/api/v1/detalle-facturas', require('./routes/compra/detalle-facturas'));


//Quoation
app.use('/api/v1/quotation', require('./routes/quotation/quotations'));

//APU
app.use('/api/v1/apu', require('./routes/apu/apus'));




// Busquedas
app.use('/api/v1/todo/', require('./routes/busquedas'));


app.listen(process.env.PORT, () => {
    console.log('Servidor ' + process.env.PORT)
})