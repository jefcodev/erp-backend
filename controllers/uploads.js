const path = require('path');
const fs = require('fs');

const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const { actualizarImage } = require("../helpers/actualiza-imagen");

const fileUpload = (req, res = response) => {
  
  const tipo = req.params.tipo;
  const id = req.params.id;


  // validar campo
  const tiposValidos = ["usuarios"];
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      msg: "No es un usuario",
    });
  }


  // Validar que exista un archivo
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "No hay ningún archivo",
    });
  }


  // procesar la imagen
  const file = req.files.imagen;
  const nombreCortado = file.name.split("."); //
  const extensionArchivo = nombreCortado[nombreCortado.length - 1];

  // validar extensión 
  const extensionesValidas = ["png", "jpg", "jpeg", "gif"];
  if (!extensionesValidas.includes(extensionArchivo)) {
    return res.status(400).json({
      ok: false,
      msg: "No es una extensión permitida",
    });
  } 


  // Generar el nombre del archivo
  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;
  const path = `./uploads/${tipo}/${nombreArchivo}`;

  // Mover Imagen
  file.mv(path, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        ok: false,
        msg: "Error al mover la imagen",
      });
    }



   // Actualzar base de datos
  actualizarImage(tipo, id, path, nombreArchivo); 

  

    res.json({
      ok: true,
      msg:'archivo subido',
      nombreArchivo

    });
  });
};


const retornarImagen = (req, res = response)=>{

  const tipo = req.params.tipo;
  const foto = req.params.foto;

  const pathImg =  path.join(__dirname, `../uploads/${tipo}/${foto}` );


// imagén por defecto 

  if (fs.existsSync(pathImg)){
    res.sendFile(pathImg);
  }
  else {
    const pathImg =  path.join(__dirname, `../uploads/no-image.jpg` );
    res.sendFile(pathImg)
  }

  


}

module.exports = {
  fileUpload,
  retornarImagen
};
