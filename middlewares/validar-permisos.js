const { db_postgres } = require("../database/config");

const validarPermisos = (permisos) => {
  return async (req, res, next) => {
    try {
      const usuarioId = req.uid;

      //console.log('Usuario: ' + usuarioId);

      const id_role = await db_postgres.oneOrNone("SELECT rol_id FROM sec_users WHERE id = $1", [usuarioId]);

      const result_role = await db_postgres.any("SELECT descripcion FROM sec_roles WHERE id = $1", [id_role.rol_id]);

      const permisosUsuario = result_role.map((row) => row.descripcion);

      // Verifica si al menos uno de los permisos del usuario está en la lista de permisos requeridos
      const tienePermiso = permisosUsuario.some((permisoUsuario) => permisos.includes(permisoUsuario));

      if (tienePermiso) {
        next();
      } else {
        return res.status(403).json({
          ok: false,
          msg: 'No tienes permiso para acceder a esta ruta'
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        ok: false,
        msg: 'Ocurrió un error en el servidor'
      });
    }
  };
};

module.exports = {
  validarPermisos
};
