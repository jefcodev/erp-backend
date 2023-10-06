const { response } = require("express");
const bcrypt = require("bcryptjs");
const { db_postgres } = require("../database/config");

const { generarJWT } = require("../helpers/jwt");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificar email

    const usuarioDB = await db_postgres.oneOrNone(
      "SELECT * FROM sec_users WHERE email = $1",
      [email]
    );
    

    //Verificar el email
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Email no encontrado",
      });
    }
    

    // Verificar contraseña
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Contraseña no válida",
      });
    }

    // Verificar estado de cuenta
    const estado = usuarioDB.estado;
    
    if(estado === false){
        return res.status(404).json({
            ok: false,
            msg: "Cuenta inactiva",
          });
    } 

    // Generar el TOKEN - JWT
    const token = await generarJWT(usuarioDB.id);

    delete usuarioDB.password;
    res.json({
      ok: true,
      token,
      usuario: usuarioDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;

  // Generar el TOKEN - JWT
  const token = await generarJWT(uid);

  const usuarioDB = await db_postgres.oneOrNone(
    "SELECT * FROM sec_users WHERE id = $1",
    [uid]
  );
  delete usuarioDB.password;

  res.json({
    ok: true,
    token,
    usuario: usuarioDB,
  });
};

module.exports = {
  login,
  renewToken,
};
