const fs = require('fs');
const { db_postgres } = require("../database/config");


const actualizarImage = async (tipo, id, path, nombreArchivo) =>{

    switch (tipo) {
        case 'usuarios':
            //const usuario = await Usuario.findById(id)
            const usuario = await db_postgres.query("SELECT * FROM sec_users where id=$1", [id]);

            if(!usuario){
                console.log('No es un usuario');
                return false;
            }
            //const pathViejo = `./uploads/usuarios/${usuario.img}`;
            //const emailExists = await db_postgres.oneOrNone("SELECT * FROM sec_users WHERE email = $1", [email]);

            const img = await db_postgres.oneOrNone("SELECT img FROM sec_users WHERE id = $1", [id]);
           
           

            const pathViejo = `./uploads/usuarios/${img.img}`;
            //console.log(pathViejo);

            if(fs.existsSync(pathViejo)){
                // borrar la imagen anterior
                fs.unlinkSync(pathViejo);
            } 
            usuario.img = nombreArchivo;
            await db_postgres.query("UPDATE sec_users SET img = $1 WHERE id = $2", [nombreArchivo, id]);
            //await usuario.save();
            return true;
        break;
        case 'condominos':
            
        break;
    
        default:
            break;
    }


}


module.exports = {
    actualizarImage
}