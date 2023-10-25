const { getPermisos } = require("../controllers/seguridad/usuarios");


const validarPermisos = (permiso) => {
    return async (req, res, next) => {
       try {
         const usuarioId = req.uid;
   
         console.log('Usuario: ' + usuarioId);
   
         const permisosUsuario = await getPermisos(usuarioId); // Sustituye esto con la función correcta que obtiene los permisos del usuario
         //const permisosUsuario = ['Create', 'Read'];
           if (permisosUsuario.includes(permiso)) {
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

  module.exports ={
validarPermisos
  }
  

