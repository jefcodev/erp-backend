/*
    Ruta: /api/v1/inventory/
*/
const { Router } = require('express');
const {check } = require('express-validator');

const { validarJWT } = require('../../middlewares/validar-jwt');
const { validarCampos } = require('../../middlewares/validar-campos');

const { getCategories, deleteCategorie, createCategorie, updateCategorie} = require('../../controllers/inventory/categories');
const { getUnits, createUnit, deleteUnit, updateUnit } = require('../../controllers/inventory/units');
const { getProducts, createProduct } = require('../../controllers/inventory/products');


const router = Router();


//Categories
router.get( '/categories' ,validarJWT, getCategories );
router.post( '/categories' ,validarJWT, createCategorie);
router.put('/categories/:id',validarJWT, updateCategorie);
router.delete('/categories/:id',validarJWT, deleteCategorie);

// Units
router.get( '/units' ,validarJWT, getUnits );
router.post( '/units' ,validarJWT, createUnit);
router.put('/units/:id',validarJWT, updateUnit);
router.delete('/units/:id',validarJWT, deleteUnit);

//Products

router.get( '/products' ,validarJWT, getProducts );
router.post( '/products' ,validarJWT, createProduct);
router.put('/products/:id',validarJWT, updateUnit);
router.delete('/products/:id',validarJWT, deleteUnit);


module.exports = router;

