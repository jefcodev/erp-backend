const { Router } = require('express');
const { getTodo, getDocumentosColeccion } = require('../controllers/busqueda')

const router = Router();

router.get('/:busqueda', getTodo);

router.get('/coleccion/:tabla/:busqueda', getDocumentosColeccion);



module.exports = router;