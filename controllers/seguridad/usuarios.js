const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../../helpers/jwt");
const { db_postgres } = require("../../database/config");

const getUsuarios = async (req, res) => {
  try {
    const desde = Number(req.query.desde) || 0;
    const limit = 5;

    // Consultas
    const queryUsers = ` SELECT * FROM sec_users OFFSET $1 LIMIT $2;`;
    const queryUsersCount = `SELECT COUNT(*) FROM sec_users ;`;

    //Promesas
    const [usuarios, total] = await Promise.all([
      db_postgres.query(queryUsers, [desde, limit]),
      db_postgres.one(queryUsersCount),
    ]);

    const totalCount = total.count;

    res.json({
      ok: true,
      usuarios,
      total: totalCount,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error al obtener los datos",
    });
  }
};



const getRol = async (req, res) => {
  try {
   
    const usuarioId = req.uid;

    //console.log('Usuario: ' + usuarioId);

    const id_role = await db_postgres.oneOrNone("SELECT rol_id FROM sec_users WHERE id = $1", [usuarioId]);
    const rol = await db_postgres.any("SELECT descripcion FROM sec_roles WHERE id = $1", [id_role.rol_id]);

    res.json({
      ok: true,
      rol,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error al obtener los datos",
    });
  }
};

const getUsuarioById = async (req, res) => {
  const id = req.params.id;

  const usuario = await db_postgres.query(
    "SELECT * FROM sec_users where id=$1",
    [id]
  );

  res.json({
    ok: true,
    usuario,
  });
};

const createUsuario = async (req, res = response) => {
  const uid = req.uid;
  const { nombre, apellido, email, password, img, rol_id } = req.body;

  try {
    // Verificar si el email ya existe
    const emailExists = await db_postgres.oneOrNone(
      "SELECT * FROM sec_users WHERE email = $1",
      [email]
    );

    if (emailExists) {
      return res.status(400).json({
        ok: false,
        msg: "El email ya existe",
      });
    }

    // Encrypta contraseña
    const salt = bcrypt.genSaltSync();
    const encryp = bcrypt.hashSync(password, salt);

    const usuario = await db_postgres.query(
      "INSERT INTO sec_users (nombre, apellido, email, password, estado, img, rol_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [nombre, apellido, email, encryp, true, img, rol_id]
    );

    // Generar el TOKEN - JWT
    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      msg: "Usuario creado correctamente",
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(501).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const updateUsuario = async (req, res = response) => {
  const { id } = req.params;
  const { nombre, apellido, email, password, img, rol_id } = req.body;

  try {
    // Verificar si el usuario existe
    const usuarioExists = await db_postgres.oneOrNone(
      "SELECT * FROM sec_users WHERE id = $1",
      [id]
    );

    if (!usuarioExists) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe",
      });
    }

    // Verificar si el correo electrónico ya está en uso por otro usuario
    const emailExists = await db_postgres.oneOrNone(
      "SELECT * FROM sec_users WHERE email = $1 AND id != $2",
      [email, id]
    );

    if (emailExists) {
      return res.status(400).json({
        ok: false,
        msg: "El correo electrónico ya está en uso",
      });
    }

    // Si la contraseña fue proporcionada, entonces encriptarla
    let encryp;
    if (password) {
      const salt = bcrypt.genSaltSync();
      encryp = bcrypt.hashSync(password, salt);
    }

    // Actualizar los datos del usuario en la base de datos
    const usuarioActualizado = await db_postgres.query(
      "UPDATE sec_users SET nombre = $1, apellido = $2, email = $3, rol_id = $4 WHERE id = $5",
      [nombre, apellido, email, rol_id, id]
    );

    res.json({
      ok: true,
      msg: "Usuario actualizado correctamente",
    });
  } catch (error) {
    console.log(error);

    res.status(501).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const deleteUsuario = async (req, res = response) => {
  const { id } = req.params;

  try {
    // Actualizar los datos del usuario en la base de datos
    const userDelete = await db_postgres.query(
      "UPDATE sec_users SET estado = $1 WHERE id = $2",
      [false, id]
    );

    res.json({
      ok: true,
      msg: "Usuario borrado correctamente",
    });
  } catch (error) {
    console.log(error);

    res.status(501).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const updateActivateUser = async (req, res = response) => {
  const { id } = req.params;

  try {
    const userUpdate = await db_postgres.query(
      "UPDATE sec_users SET estado = $1 WHERE id = $2",
      [true, id]
    );

    res.json({
      ok: true,
      msg: "Usuario activado correctamente",
    });
  } catch (error) {
    console.log(error);

    res.status(501).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};


const getPermisos = async (usuarioId, res) => {
  try {
    console.log("getPermisos uid: " + usuarioId);

    const rolResult = await db_postgres.oneOrNone(
      "SELECT rol_id FROM sec_users WHERE id = $1",
      [usuarioId]
    );
    console.log("Rol result: ", rolResult.rol_id);

    const id_rol = rolResult.rol_id;

    const permisosResult = await db_postgres.any("SELECT p.nombre FROM sec_permisos AS p JOIN roles_modulos_permisos AS rmp ON rmp.id_permiso = p.id WHERE rmp.id_rol = $1", [id_rol]);

    const permisos = permisosResult.map((row) => row.nombre);

    console.log('Permisos: ' + permisos);

    if (Array.isArray(permisos) && permisos.length > 0) {
      return permisos;
    } else {
      console.log("No se encontraron filas en el resultado.");
      return [];
    }
  } catch (error) {
    console.error("Error en getPermisos:", error);
    throw error;
  }
};


module.exports = {
  getUsuarios,
  getRol,
  getUsuarioById,
  getPermisos,
  createUsuario,
  deleteUsuario,
  updateUsuario,
  updateActivateUser,
};
