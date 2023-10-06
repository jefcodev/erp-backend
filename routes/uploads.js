const {Router} = require ('express');

const expressFileUpload = require('express-fileupload');


const { fileUpload, retornarImagen } = require('../controllers/uploads');


const router = Router();

router.use(expressFileUpload())
router.put('/:tipo/:id', fileUpload)

router.get('/:tipo/:foto', retornarImagen)


module.exports = router;