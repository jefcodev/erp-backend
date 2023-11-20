const { validationResult } = require("express-validator");
const { db_postgres } = require("../../database/config");

// Obtener el estado de resultado en un rango de fechas
const getEstadoResultadoFecha = async (req, res) => {
    try {
        const fechaInicio = req.params.fecha_inicio;
        const fechaFin = req.params.fecha_fin;

        const estado_resultado = await db_postgres.query(
            `
            SELECT c.ID_CUENTA, c.CODIGO, c.DESCRIPCION, 
                CASE 
                    WHEN c.CODIGO LIKE '5%' THEN ABS(SUM(da.HABER) - SUM(da.DEBE)) 
                    ELSE SUM(da.HABER) - SUM(da.DEBE) 
                END AS SALDO 
            FROM CONT_CUENTAS c  
                LEFT JOIN CONT_DETALLES_ASIENTOS da ON c.ID_CUENTA = da.ID_CUENTA 
                LEFT JOIN CONT_ASIENTOS a ON da.ID_ASIENTO = a.ID_ASIENTO
            WHERE (c.CODIGO LIKE '4%' OR c.CODIGO LIKE '5%' OR c.CODIGO LIKE '6%')  
                AND (a.FECHA_ASIENTO BETWEEN $1 AND $2)
                AND a.ESTADO = true  -- Agregamos la condición para el estado true
            GROUP BY c.ID_CUENTA, c.CODIGO, c.DESCRIPCION  
            HAVING SUM(da.HABER) - SUM(da.DEBE) IS NOT NULL  
            UNION  
            SELECT 4, '4', 'INGRESOS', NULL  
            UNION  
            SELECT 5, '5', 'EGRESOS', NULL  
            UNION  
            SELECT 6, '6', 'GASTOS', NULL  
            ORDER BY CODIGO;
            `,
            [fechaInicio, fechaFin]
        );

        res.json({
            ok: true,
            estado_resultado,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el estado de resultado.",
        });
    }
};

// Obtener la suma de debe y haber del libro diario
const getSumaIEGFecha = async (req, res) => {
    try {

        const fechaInicio = req.params.fecha_inicio;
        const fechaFin = req.params.fecha_fin;

        const suma_ieg = await db_postgres.query(
            `
            SELECT
                SUM(CASE WHEN c.CODIGO LIKE '4%' THEN da.HABER - da.DEBE ELSE 0 END) AS Ingresos,
                ABS(SUM(CASE WHEN c.CODIGO LIKE '5%' THEN da.HABER - da.DEBE ELSE 0 END)) AS Egresos,
                SUM(CASE WHEN c.CODIGO LIKE '6%' THEN da.HABER - da.DEBE ELSE 0 END) AS Gastos
            FROM CONT_CUENTAS c
            LEFT JOIN CONT_DETALLES_ASIENTOS da ON c.ID_CUENTA = da.ID_CUENTA
            LEFT JOIN CONT_ASIENTOS a ON da.ID_ASIENTO = a.ID_ASIENTO
            WHERE (c.CODIGO LIKE '4%' OR c.CODIGO LIKE '5%' OR c.CODIGO LIKE '6%')  
            AND (a.FECHA_ASIENTO BETWEEN $1 AND $2)
            AND a.ESTADO = true; 
            `,
            [fechaInicio, fechaFin]
        );
        res.json({
            ok: true,
            suma_ieg,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener la suma.",
        });
    }
};


// Obtener el estado de resultado
const getEstadoResultado = async (req, res) => {
    try {
        const estado_resultado = await db_postgres.query(
            `
            SELECT c.ID_CUENTA, c.CODIGO, c.DESCRIPCION, SUM(da.DEBE) - SUM(da.HABER) AS SALDO 
            FROM CONT_CUENTAS c  
            LEFT JOIN CONT_DETALLES_ASIENTOS da ON c.ID_CUENTA = da.ID_CUENTA 
            WHERE c.CODIGO LIKE '4%' OR c.CODIGO LIKE '5%' OR c.CODIGO LIKE '6%'  
            GROUP BY c.ID_CUENTA, c.CODIGO, c.DESCRIPCION  
            HAVING SUM(da.DEBE) - SUM(da.HABER) IS NOT NULL  
            UNION  
            SELECT 4, '4', 'INGRESOS', NULL  
            UNION  
            SELECT 5, '5', 'EGRESOS', NULL  
            UNION  
            SELECT 6, '6', 'GASTOS', NULL  
            ORDER BY CODIGO
            `
        );
        res.json({
            ok: true,
            estado_resultado,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el estado de resultado.",
        });
    }
};


// Obtener la suma de debe y haber del libro diario
const getSumaIEG = async (req, res) => {
    try {
        const suma_ieg = await db_postgres.query(

            "SELECT " +
            "SUM(CASE WHEN c.CODIGO LIKE '4%' THEN da.DEBE - da.HABER ELSE 0 END) AS Ingreso, " +
            "SUM(CASE WHEN c.CODIGO LIKE '5%' THEN da.DEBE - da.HABER ELSE 0 END) AS Egreso, " +
            "SUM(CASE WHEN c.CODIGO LIKE '6%' THEN da.DEBE - da.HABER ELSE 0 END) AS Gasto " +
            "FROM CONT_CUENTAS c " +
            "LEFT JOIN CONT_DETALLES_ASIENTOS da ON c.ID_CUENTA = da.ID_CUENTA " +
            "WHERE c.CODIGO LIKE '4%' OR c.CODIGO LIKE '5%' OR c.CODIGO LIKE '6%'"
        );
        res.json({
            ok: true,
            suma_ieg,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener la suma.",
        });
    }
};

module.exports = {
    getEstadoResultado,
    getSumaIEG,
    getEstadoResultadoFecha,
    getSumaIEGFecha,
};
