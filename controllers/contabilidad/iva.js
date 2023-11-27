const { validationResult } = require("express-validator");
const { db_postgres } = require("../../database/config");

// Obtener el IVA
const getIVA = async (req, res) => {
    try {
        const iva = await db_postgres.query(
            `
            -- Ventas diferente de 0% IVA
            SELECT
            'VENTAS DIFERENTE 0% IVA' AS Categoria,
            '401' AS Casillero,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 1 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS base_enero,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 1 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS iva_enero,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 2 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS base_febrero,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 2 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS iva_febrero,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 3 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS base_marzo,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 3 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS iva_marzo,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 4 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS base_abril,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 4 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS iva_abril,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 5 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS base_mayo,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 5 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS iva_mayo,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 6 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS base_junio,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 6 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS iva_junio,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) BETWEEN 1 AND 6 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base_Primer_Semestre,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) BETWEEN 1 AND 6 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA_Primer_Semestre,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 7 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS base_julio,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 7 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS iva_julio,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 8 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS base_agosto,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 8 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS iva_agosto,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 9 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS base_septiembre,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 9 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS iva_septiembre,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 10 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS base_octubre,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 10 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS iva_octubre,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 11 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS base_noviembre,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 11 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS iva_noviembre,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 12 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS base_diciembre,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 12 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS iva_diciembre,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) BETWEEN 7 AND 12 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base_Segundo_Semestre,
            SUM(CASE WHEN VALOR > 0 AND EXTRACT(MONTH FROM FECHA_EMISION) BETWEEN 7 AND 12 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA_Segundo_Semestre,
            SUM(CASE WHEN VALOR > 0 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base_Anual,
            SUM(CASE WHEN VALOR > 0 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA_Anual
            FROM VENT_VENTAS

            -- Ventas con 0% IVA
            UNION ALL
            SELECT
            'VENTAS CON 0% DE IVA' AS Categoria,
            '403-405' AS Casillero,
            SUM(CASE WHEN VALOR = 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 1 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS BaseEnero,
            NULL AS IVA,
            SUM(CASE WHEN VALOR = 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 2 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            NULL AS IVA,
            SUM(CASE WHEN VALOR = 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 3 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            NULL AS IVA,
            SUM(CASE WHEN VALOR = 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 4 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            NULL AS IVA,
            SUM(CASE WHEN VALOR = 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 5 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            NULL AS IVA,
            SUM(CASE WHEN VALOR = 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 6 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            NULL AS IVA,
            SUM(CASE WHEN VALOR = 0 AND EXTRACT(MONTH FROM FECHA_EMISION) BETWEEN 1 AND 6 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base_Primer_Semestre,
            NULL AS IVA,
            SUM(CASE WHEN VALOR = 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 7 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            NULL AS IVA,
            SUM(CASE WHEN VALOR = 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 8 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            NULL AS IVA,
            SUM(CASE WHEN VALOR = 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 9 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            NULL AS IVA,
            SUM(CASE WHEN VALOR = 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 10 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            NULL AS IVA,
            SUM(CASE WHEN VALOR = 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 11 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            NULL AS IVA,
            SUM(CASE WHEN VALOR = 0 AND EXTRACT(MONTH FROM FECHA_EMISION) = 12 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            NULL AS IVA,
            SUM(CASE WHEN VALOR = 0 AND EXTRACT(MONTH FROM FECHA_EMISION) BETWEEN 7 AND 12 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base_Segundo_Semestre,
            NULL AS IVA,
            SUM(CASE WHEN VALOR = 0 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Total_Base,
            NULL AS IVA
            FROM VENT_VENTAS

            -- Compras con crédito tributario
            UNION ALL
            SELECT
            'COMPRAS 12% con derecho ct' AS Categoria,
            '500' AS Casillero,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 1 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS BaseEnero,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 1 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 2 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 2 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 3 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 3 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 4 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 4 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 5 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 5 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 6 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 6 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) BETWEEN 1 AND 6 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base_Primer_Semestre,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) BETWEEN 1 AND 6 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA_Primer_Semestre,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 7 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 7 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 8 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 8 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 9 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 9 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 10 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 10 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 11 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 11 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 12 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) = 12 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) BETWEEN 7 AND 12 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base_Segundo_Semestre,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true AND EXTRACT(MONTH FROM FECHA_EMISION) BETWEEN 7 AND 12 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA_Segundo_Semestre,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Total_Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = true THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS Total_IVA
            FROM COMP_COMPRAS

            -- Compras sin crédito tributario
            UNION ALL
            SELECT
            'COMPRAS 12% sin derecho ct' AS Categoria,
            '502' AS Casillero,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 1 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS BaseEnero,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 1 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 2 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 2 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 3 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 3 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 4 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 4 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 5 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 5 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 6 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 6 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) BETWEEN 1 AND 6 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base_Primer_Semestre,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) BETWEEN 1 AND 6 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA_Primer_Semestre,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 7 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 7 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 8 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 8 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 9 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 9 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 10 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 10 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 11 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 11 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 12 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) = 12 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) BETWEEN 7 AND 12 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base_Segundo_Semestre,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false AND EXTRACT(MONTH FROM FECHA_EMISION) BETWEEN 7 AND 12 THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS IVA_Segundo_Semestre,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Total_Base,
            SUM(CASE WHEN CREDITO_TRIBUTARIO = false THEN TOTAL_SIN_IMPUESTO * 0.12 ELSE 0 END) AS Total_IVA
            FROM COMP_COMPRAS

            -- Compras Cero
            UNION all
            SELECT
            'COMPRAS 0%' AS Categoria,
            '507-508' AS Casillero,
            SUM(CASE WHEN CREDITO_TRIBUTARIO IS NULL AND EXTRACT(MONTH FROM FECHA_EMISION) = 1 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS BaseEnero,
            NULL AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO IS NULL AND EXTRACT(MONTH FROM FECHA_EMISION) = 2 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            NULL AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO IS NULL AND EXTRACT(MONTH FROM FECHA_EMISION) = 3 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            NULL AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO IS NULL AND EXTRACT(MONTH FROM FECHA_EMISION) = 4 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            NULL AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO IS NULL AND EXTRACT(MONTH FROM FECHA_EMISION) = 5 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            NULL AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO IS NULL AND EXTRACT(MONTH FROM FECHA_EMISION) = 6 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            NULL AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO IS NULL AND EXTRACT(MONTH FROM FECHA_EMISION) BETWEEN 1 AND 6 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base_Primer_Semestre,
            NULL AS IVA_Primer_Semestre,
            SUM(CASE WHEN CREDITO_TRIBUTARIO IS NULL AND EXTRACT(MONTH FROM FECHA_EMISION) = 7 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            NULL AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO IS NULL AND EXTRACT(MONTH FROM FECHA_EMISION) = 8 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            NULL AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO IS NULL AND EXTRACT(MONTH FROM FECHA_EMISION) = 9 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            NULL AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO IS NULL AND EXTRACT(MONTH FROM FECHA_EMISION) = 10 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            NULL AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO IS NULL AND EXTRACT(MONTH FROM FECHA_EMISION) = 11 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            NULL AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO IS NULL AND EXTRACT(MONTH FROM FECHA_EMISION) = 12 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base,
            NULL AS IVA,
            SUM(CASE WHEN CREDITO_TRIBUTARIO IS NULL AND EXTRACT(MONTH FROM FECHA_EMISION) BETWEEN 7 AND 12 THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Base_Segundo_Semestre,
            NULL AS IVA_Segundo_Semestre,
            SUM(CASE WHEN CREDITO_TRIBUTARIO IS NULL THEN TOTAL_SIN_IMPUESTO ELSE 0 END) AS Total_Base,
            NULL AS Total_IVA
            FROM COMP_COMPRAS

            -- Total compras
            UNION ALL
            SELECT
            'TOTAL DE COMPRAS' AS Mes,
            '' AS Casillero,
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM FECHA_EMISION) = 1 THEN TOTAL_SIN_IMPUESTO ELSE 0 END), 0) AS BaseEnero,
            NULL AS IVA,
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM FECHA_EMISION) = 2 THEN TOTAL_SIN_IMPUESTO ELSE 0 END), 0) AS Base,
            NULL AS IVA,
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM FECHA_EMISION) = 3 THEN TOTAL_SIN_IMPUESTO ELSE 0 END), 0) AS Base,
            NULL AS IVA,
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM FECHA_EMISION) = 4 THEN TOTAL_SIN_IMPUESTO ELSE 0 END), 0) AS Base,
            NULL AS IVA,
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM FECHA_EMISION) = 5 THEN TOTAL_SIN_IMPUESTO ELSE 0 END), 0) AS Base,
            NULL AS IVA,
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM FECHA_EMISION) = 6 THEN TOTAL_SIN_IMPUESTO ELSE 0 END), 0) AS Base,
            NULL AS IVA,
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM FECHA_EMISION) BETWEEN 1 AND 6 THEN TOTAL_SIN_IMPUESTO ELSE 0 END), 0) AS Base_Primer_Semestre,
            NULL AS IVA_Primer_Semestre,
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM FECHA_EMISION) = 7 THEN TOTAL_SIN_IMPUESTO ELSE 0 END), 0) AS Base,
            NULL AS IVA,
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM FECHA_EMISION) = 8 THEN TOTAL_SIN_IMPUESTO ELSE 0 END), 0) AS Base,
            NULL AS IVA,
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM FECHA_EMISION) = 9 THEN TOTAL_SIN_IMPUESTO ELSE 0 END), 0) AS Base,
            NULL AS IVA,
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM FECHA_EMISION) = 10 THEN TOTAL_SIN_IMPUESTO ELSE 0 END), 0) AS Base,
            NULL AS IVA,
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM FECHA_EMISION) = 11 THEN TOTAL_SIN_IMPUESTO ELSE 0 END), 0) AS Base,
            NULL AS IVA,
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM FECHA_EMISION) = 12 THEN TOTAL_SIN_IMPUESTO ELSE 0 END), 0) AS Base,
            NULL AS IVA,
            COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM FECHA_EMISION) BETWEEN 7 AND 12 THEN TOTAL_SIN_IMPUESTO ELSE 0 END), 0) AS Base_Segundo_Semestre,
            NULL AS IVA_Segundo_Semestre,
            COALESCE(SUM(TOTAL_SIN_IMPUESTO), 0) AS Total_Base,
            NULL AS Total_IVA
            FROM
            COMP_COMPRAS
            
            -- Impuesto causado
            union all

            SELECT
            'IMPUESTO CAUSADO' AS Categoria,
            '' AS Casillero,
            NULL AS BaseEnero,
            SUM(CASE WHEN Mes = 1 THEN Ventas_Valor - COALESCE(Compras_Valor, 0) ELSE 0 END) AS IVA,
            NULL AS Base,
            SUM(CASE WHEN Mes = 2 THEN Ventas_Valor - COALESCE(Compras_Valor, 0) ELSE 0 END) AS IVA,
            NULL AS Base,
            SUM(CASE WHEN Mes = 3 THEN Ventas_Valor - COALESCE(Compras_Valor, 0) ELSE 0 END) AS IVA,
            NULL AS Base,
            SUM(CASE WHEN Mes = 4 THEN Ventas_Valor - COALESCE(Compras_Valor, 0) ELSE 0 END) AS IVA,
            NULL AS Base,
            SUM(CASE WHEN Mes = 5 THEN Ventas_Valor - COALESCE(Compras_Valor, 0) ELSE 0 END) AS IVA,
            NULL AS Base,
            SUM(CASE WHEN Mes = 6 THEN Ventas_Valor - COALESCE(Compras_Valor, 0) ELSE 0 END) AS IVA,
            null AS Base_Primer_Semestre,
            SUM(CASE WHEN Mes BETWEEN 1 and 6 THEN Ventas_Valor - COALESCE(Compras_Valor, 0) ELSE 0 END) AS IVA_Primer_Semestre, 
            NULL AS Base,
            SUM(CASE WHEN Mes = 7 THEN Ventas_Valor - COALESCE(Compras_Valor, 0) ELSE 0 END) AS IVA,
            NULL AS Base,
            SUM(CASE WHEN Mes = 8 THEN Ventas_Valor - COALESCE(Compras_Valor, 0) ELSE 0 END) AS IVA,
            NULL AS Base,
            SUM(CASE WHEN Mes = 9 THEN Ventas_Valor - COALESCE(Compras_Valor, 0) ELSE 0 END) AS IVA,
            NULL AS Base,
            SUM(CASE WHEN Mes = 10 THEN Ventas_Valor - COALESCE(Compras_Valor, 0) ELSE 0 END) AS IVA,
            NULL AS Base,
            SUM(CASE WHEN Mes = 11 THEN Ventas_Valor - COALESCE(Compras_Valor, 0) ELSE 0 END) AS IVA,
            NULL AS Base,
            SUM(CASE WHEN Mes = 12 THEN Ventas_Valor - COALESCE(Compras_Valor, 0) ELSE 0 END) AS IVA,
            null AS Base_Segundo_Semestre,
            SUM(CASE WHEN Mes BETWEEN 7 and 12 THEN Ventas_Valor - COALESCE(Compras_Valor, 0) ELSE 0 END) AS IVA_Seguhdo_Semestre, 
            null AS Total_Base,
            --SUM(CASE WHEN Mes BETWEEN 1 and 12 THEN Ventas_Valor - COALESCE(Compras_Valor, 0) ELSE 0 END) AS Total_IVA 
            SUM(Ventas_Valor - COALESCE(Compras_Valor, 0)) AS Total_IVA 

            FROM (
            SELECT
                EXTRACT(MONTH FROM FECHA_EMISION) AS Mes,
                VALOR AS Ventas_Valor,
                0 AS Compras_Valor
            FROM VENT_VENTAS

            UNION ALL

            SELECT
                EXTRACT(MONTH FROM FECHA_EMISION) AS Mes,
                0 AS Ventas_Valor,
                CASE WHEN CREDITO_TRIBUTARIO = true THEN VALOR ELSE 0 END AS Compras_Valor
            FROM COMP_COMPRAS
            ) AS CombinedData;
            `
        );
        res.json({
            ok: true,
            iva,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: "Error al obtener el libro diario.",
        });
    }
};

// Obtener la suma de debe y haber del libro diario
const getSumaDebeHaber = async (req, res) => {
    try {
        const suma_debe_haber = await db_postgres.query(
            "SELECT SUM(debe) AS total_debe, SUM(haber) AS total_haber FROM cont_detalles_asientos");
        res.json({
            ok: true,
            suma_debe_haber,
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
    getIVA,
    getSumaDebeHaber,
};
