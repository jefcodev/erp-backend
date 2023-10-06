const { response } = require("express");

const getTodo = async (req, res = response) => {
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, "i");

  const [usuarios, condominos] = await Promise.all([
    Usuario.find({ nombre: regex }),
    Condomino.find({ nombre: regex }),
  ]);

  res.json({
    ok: true,
    msg: "getTodo",
    usuarios,
    condominos,
  });
};
const getDocumentosColeccion = async (req, res = response) => {
  const tabla = req.params.tabla;
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, "i");
  let data = [];

  switch (tabla) {
    case "usuarios":
      data = await Usuario.find({ nombre: regex });

      break;

    

    default:
      return res.json({
        ok: false,
        msg: "La tabla tiene que se una de la colección",
      });
       
  }

  res.json({
    ok: true,
    resultados: data,
  });
  
};

module.exports = {
  getTodo,
  getDocumentosColeccion,
};
