/*==============================================================*/
/* DBMS name:      PostgreSQL 9.x                               */
/* Created on:     10/7/2023 11:45:35 PM                        */
/*==============================================================*/


drop index APU_APU_PK;

drop table APU_APU;

drop index RELATIONSHIP_43_FK;

drop index RELATIONSHIP_39_FK;

drop index APU_MATERIALES_PK;

drop table APU_MATERIALES;

drop index RELATIONSHIP_38_FK;

drop index APU_TRABAJO_PK;

drop table APU_TRABAJO;

drop index RELATIONSHIP_40_FK;

drop index APU_TRANSPORTE_PK;

drop table APU_TRANSPORTE;

drop index RELATIONSHIP_20_FK;

drop index RELATIONSHIP_19_FK;

drop index COM_DETALLE_FACTURAS_COMPRAS_PK;

drop table COMP_DETALLE_FACTURAS_COMPRAS;

drop index RELATIONSHIP_53_FK;

drop index RELATIONSHIP_36_FK;

drop index RELATIONSHIP_31_FK;

drop index RELATIONSHIP_32_FK;

drop index RELATIONSHIP_22_FK;

drop index COMP_FACTURAS_COMPRAS_PK;

drop table COMP_FACTURAS_COMPRAS;

drop index COMP_PROVEEDORES_PK;

drop table COMP_PROVEEDORES;

drop index ASIENTOS_PK;

drop table CONT_ASIENTOS;

drop index RELATIONSHIP_25_FK;

drop index RELATIONSHIP_24_FK;

drop index RELATIONSHIP_23_FK;

drop index CONT_COMPROBANTES_CONTABLES_PK;

drop table CONT_COMPROBANTES_CONTABLES;

drop index CONT_CUENTAS_PK;

drop table CONT_CUENTAS;

drop index CONT_CUENTAS_BANCARIAS_PK;

drop table CONT_CUENTAS_BANCARIAS;

drop index RELATIONSHIP_35_FK;

drop index RELATIONSHIP_34_FK;

drop index DETALLE_ASIENTOS_PK;

drop table CONT_DETALLE_ASIENTOS;

drop index CONT_EJERCICIOS_FISCALES_PK;

drop table CONT_EJERCICIOS_FISCALES;

drop index CONT_ESTADOS_COMPROBANTES_PK;

drop table CONT_ESTADOS_COMPROBANTES;

drop index CONT_FORMA_PAGO_PK;

drop table CONT_FORMAS_PAGO;

drop index CONT_IVA_PK;

drop table CONT_IVA;

drop index RELATIONSHIP_50_FK;

drop index RELATIONSHIP_49_FK;

drop index RELATIONSHIP_48_FK;

drop index CONT_PAGOS_PK;

drop table CONT_PAGOS;

drop index RELATIONSHIP_3_FK;

drop index CONT_PERIODOS_CONTABLES_PK;

drop table CONT_PERIODOS_CONTABLES;

drop index CONT_TIPOS_COMPROBANTES_PK;

drop table CONT_TIPOS_COMPROBANTES;

drop index INFORMACION_TRIBUTARIA_PK;

drop table INFORMACION_TRIBUTARIA;

drop index INVE_CATEGORIAS_PK;

drop table INVE_CATEGORIAS;

drop index INVE_ICE_PK;

drop table INVE_ICE;

drop index INVE_PACKS_PK;

drop table INVE_PACKS;

drop index RELATIONSHIP_44_FK;

drop index INVE_PRECIOS_PK;

drop table INVE_PRECIOS;

drop index RELATIONSHIP_46_FK;

drop index RELATIONSHIP_47_FK;

drop index RELATIONSHIP_45_FK;

drop index RELATIONSHIP_42_FK;

drop index INVE_PRODUCTOS_PK;

drop table INVE_PRODUCTOS;

drop index RELATIONSHIP_17_FK;

drop index RELATIONSHIP_16_FK;

drop index INVE_PRODUCTOS_PACKS_PK;

drop table INVE_PRODUCTOS_PACKS;

drop index INVE_TIPOS_INVENTARIOS_PK;

drop table INVE_TIPOS_INVENTARIOS;

drop index INVE_UNIDADES_PK;

drop table INVE_UNIDADES;

drop index SEC_ROLES_PK;

drop table SEC_ROLES;

drop index RELATIONSHIP_28_FK;

drop index SEC_USERS_PK;

drop table SEC_USERS;

drop index RELATIONSHIP_41_FK;

drop index VENT_CLIENTES_PK;

drop table VENT_CLIENTES;

drop index RELATIONSHIP_21_FK;

drop index RELATIONSHIP_30_FK;

drop index RELATIONSHIP_29_FK;

drop index VENT_DETALLE_FACTURAS_VENTAS_PK;

drop table VENT_DETALLE_FACTURAS_VENTAS;

drop index RELATIONSHIP_54_FK;

drop index RELATIONSHIP_37_FK;

drop index RELATIONSHIP_33_FK;

drop index RELATIONSHIP_27_FK;

drop index RELATIONSHIP_26_FK;

drop index VENT_FACTURAS_VENTAS_PK;

drop table VENT_FACTURAS_VENTAS;

drop index VENT_GRUPOS_CLIENTES_PK;

drop table VENT_GRUPOS_CLIENTES;

/*==============================================================*/
/* Table: APU_APU                                               */
/*==============================================================*/
create table APU_APU (
   ID_APU               SERIAL               not null,
   FECHA_APU            DATE                 null,
   METROS               DECIMAL(12,2)        null,
   LUGAR                TEXT                 null,
   PORCENTAJE           DECIMAL(12,2)        null,
   USUARIO              TEXT                 null,
   TOTAL                DECIMAL(12,2)        null,
   constraint PK_APU_APU primary key (ID_APU)
);

/*==============================================================*/
/* Index: APU_APU_PK                                            */
/*==============================================================*/
create unique index APU_APU_PK on APU_APU (
ID_APU
);

/*==============================================================*/
/* Table: APU_MATERIALES                                        */
/*==============================================================*/
create table APU_MATERIALES (
   ID_MATERIALES        SERIAL               not null,
   ID_APU               INT4                 null,
   ID_PRODUCTO          INT4                 null,
   CANTIDAD             INT4                 null,
   PRECIO               DECIMAL(12,2)        null,
   constraint PK_APU_MATERIALES primary key (ID_MATERIALES)
);

/*==============================================================*/
/* Index: APU_MATERIALES_PK                                     */
/*==============================================================*/
create unique index APU_MATERIALES_PK on APU_MATERIALES (
ID_MATERIALES
);

/*==============================================================*/
/* Index: RELATIONSHIP_39_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_39_FK on APU_MATERIALES (
ID_APU
);

/*==============================================================*/
/* Index: RELATIONSHIP_43_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_43_FK on APU_MATERIALES (
ID_PRODUCTO
);

/*==============================================================*/
/* Table: APU_TRABAJO                                           */
/*==============================================================*/
create table APU_TRABAJO (
   ID_TRABAJO           SERIAL               not null,
   ID_APU               INT4                 null,
   DESCRIPCION          TEXT                 null,
   CANTIDAD             INT4                 null,
   PRECIO               DECIMAL(12,2)        null,
   constraint PK_APU_TRABAJO primary key (ID_TRABAJO)
);

/*==============================================================*/
/* Index: APU_TRABAJO_PK                                        */
/*==============================================================*/
create unique index APU_TRABAJO_PK on APU_TRABAJO (
ID_TRABAJO
);

/*==============================================================*/
/* Index: RELATIONSHIP_38_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_38_FK on APU_TRABAJO (
ID_APU
);

/*==============================================================*/
/* Table: APU_TRANSPORTE                                        */
/*==============================================================*/
create table APU_TRANSPORTE (
   ID_TRANSPORTE        SERIAL               not null,
   ID_APU               INT4                 null,
   DESCRIPCION          TEXT                 null,
   PRECIO               DECIMAL(12,2)        null,
   constraint PK_APU_TRANSPORTE primary key (ID_TRANSPORTE)
);

/*==============================================================*/
/* Index: APU_TRANSPORTE_PK                                     */
/*==============================================================*/
create unique index APU_TRANSPORTE_PK on APU_TRANSPORTE (
ID_TRANSPORTE
);

/*==============================================================*/
/* Index: RELATIONSHIP_40_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_40_FK on APU_TRANSPORTE (
ID_APU
);

/*==============================================================*/
/* Table: COMP_DETALLE_FACTURAS_COMPRAS                         */
/*==============================================================*/
create table COMP_DETALLE_FACTURAS_COMPRAS (
   ID_DETALLE_FACTURA_COMPRA SERIAL               not null,
   ID_PRODUCTO          INT4                 null,
   ID_FACTURA_COMPRA    INT4                 null,
   CODIGO_PRINCIPAL     TEXT                 not null,
   CODIGO_AUXILIAR      TEXT                 null,
   CANTIDAD             DECIMAL(12,6)        not null,
   DESCRIPCION          TEXT                 not null,
   DETALLE_ADICIONAL    TEXT                 null,
   PRECIO_UNITARIO      DECIMAL(12,6)        not null,
   SUBSIDIO             DECIMAL(12,2)        null,
   PRECIO_SIN_SUBSIDIO  DECIMAL(12,2)        null,
   DESCUENTO            DECIMAL(12,2)        null,
   PRECIO_TOTAL         DECIMAL(12,2)        not null,
   IVA                  DECIMAL(12,2)        null,
   ICE                  DECIMAL(12,2)        null,
   constraint PK_COMP_DETALLE_FACTURAS_COMPR primary key (ID_DETALLE_FACTURA_COMPRA)
);

/*==============================================================*/
/* Index: COM_DETALLE_FACTURAS_COMPRAS_PK                       */
/*==============================================================*/
create unique index COM_DETALLE_FACTURAS_COMPRAS_PK on COMP_DETALLE_FACTURAS_COMPRAS (
ID_DETALLE_FACTURA_COMPRA
);

/*==============================================================*/
/* Index: RELATIONSHIP_19_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_19_FK on COMP_DETALLE_FACTURAS_COMPRAS (
ID_PRODUCTO
);

/*==============================================================*/
/* Index: RELATIONSHIP_20_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_20_FK on COMP_DETALLE_FACTURAS_COMPRAS (
ID_FACTURA_COMPRA
);

/*==============================================================*/
/* Table: COMP_FACTURAS_COMPRAS                                 */
/*==============================================================*/
create table COMP_FACTURAS_COMPRAS (
   ID_FACTURA_COMPRA    SERIAL               not null,
   ID_PROVEEDOR         INT4                 null,
   ID_FORMA_PAGO        INT4                 null,
   ID_CUENTA            INT4                 null,
   ID_ASIENTO           INT4                 null,
   ID_IVA               INT4                 null,
   CODIGO               TEXT                 null,
   FECHA_EMISION        DATE                 null,
   FECHA_VENCIMIENTO    DATE                 null,
   ESTADO_PAGO          TEXT                 null,
   SUBTOTAL_SIN_IMPUESTOS DECIMAL(12,2)        null,
   TOTAL_DESCUENTO      DECIMAL(12,2)        null,
   IVA                  DECIMAL(12,2)        null,
   VALOR_TOTAL          DECIMAL(12,2)        null,
   ABONO                DECIMAL(12,2)        null,
   ESTADO               BOOL                 null,
   constraint PK_COMP_FACTURAS_COMPRAS primary key (ID_FACTURA_COMPRA)
);

/*==============================================================*/
/* Index: COMP_FACTURAS_COMPRAS_PK                              */
/*==============================================================*/
create unique index COMP_FACTURAS_COMPRAS_PK on COMP_FACTURAS_COMPRAS (
ID_FACTURA_COMPRA
);

/*==============================================================*/
/* Index: RELATIONSHIP_22_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_22_FK on COMP_FACTURAS_COMPRAS (
ID_PROVEEDOR
);

/*==============================================================*/
/* Index: RELATIONSHIP_32_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_32_FK on COMP_FACTURAS_COMPRAS (
ID_FORMA_PAGO
);

/*==============================================================*/
/* Index: RELATIONSHIP_31_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_31_FK on COMP_FACTURAS_COMPRAS (
ID_CUENTA
);

/*==============================================================*/
/* Index: RELATIONSHIP_36_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_36_FK on COMP_FACTURAS_COMPRAS (
ID_ASIENTO
);

/*==============================================================*/
/* Index: RELATIONSHIP_53_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_53_FK on COMP_FACTURAS_COMPRAS (
ID_IVA
);

/*==============================================================*/
/* Table: COMP_PROVEEDORES                                      */
/*==============================================================*/
create table COMP_PROVEEDORES (
   ID_PROVEEDOR         SERIAL               not null,
   IDENTIFICACION       TEXT                 not null,
   NOMBRE               TEXT                 not null,
   APELLIDO             TEXT                 not null,
   NOMBRE_COMERCIAL     TEXT                 not null,
   DIRECCION            TEXT                 not null,
   TELEFONO             TEXT                 not null,
   EMAIL                TEXT                 not null,
   ESTADO               BOOL                 not null,
   constraint PK_COMP_PROVEEDORES primary key (ID_PROVEEDOR)
);

/*==============================================================*/
/* Index: COMP_PROVEEDORES_PK                                   */
/*==============================================================*/
create unique index COMP_PROVEEDORES_PK on COMP_PROVEEDORES (
ID_PROVEEDOR
);

/*==============================================================*/
/* Table: CONT_ASIENTOS                                         */
/*==============================================================*/
create table CONT_ASIENTOS (
   ID_ASIENTO           SERIAL               not null,
   FECHA                DATE                 not null,
   REFERENCIA           TEXT                 null,
   DOCUMENTO            TEXT                 null,
   OBSERVACION          TEXT                 null,
   ESTADO               BOOL                 not null,
   constraint PK_CONT_ASIENTOS primary key (ID_ASIENTO)
);

/*==============================================================*/
/* Index: ASIENTOS_PK                                           */
/*==============================================================*/
create unique index ASIENTOS_PK on CONT_ASIENTOS (
ID_ASIENTO
);

/*==============================================================*/
/* Table: CONT_COMPROBANTES_CONTABLES                           */
/*==============================================================*/
create table CONT_COMPROBANTES_CONTABLES (
   ID_COMPROBANTES_CONTABLES SERIAL               not null,
   ID_EJERCICIO_FISCAL  INT4                 null,
   ID_TIPO_COMPROBANTE  INT4                 null,
   ID_ESTADO_COMPROBANTE INT4                 null,
   CODIGO               TEXT                 not null,
   FECHA_EMISION        DATE                 not null,
   SUBTOTAL_SIN_IMPUESTOS DECIMAL(7,2)         not null,
   TOTAL_DESCUENTO      DECIMAL(7,2)         null,
   IVA                  DECIMAL(7,2)         not null,
   VALOR_TOTAL          DECIMAL(7,2)         not null,
   constraint PK_CONT_COMPROBANTES_CONTABLES primary key (ID_COMPROBANTES_CONTABLES)
);

/*==============================================================*/
/* Index: CONT_COMPROBANTES_CONTABLES_PK                        */
/*==============================================================*/
create unique index CONT_COMPROBANTES_CONTABLES_PK on CONT_COMPROBANTES_CONTABLES (
ID_COMPROBANTES_CONTABLES
);

/*==============================================================*/
/* Index: RELATIONSHIP_23_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_23_FK on CONT_COMPROBANTES_CONTABLES (
ID_EJERCICIO_FISCAL
);

/*==============================================================*/
/* Index: RELATIONSHIP_24_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_24_FK on CONT_COMPROBANTES_CONTABLES (
ID_TIPO_COMPROBANTE
);

/*==============================================================*/
/* Index: RELATIONSHIP_25_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_25_FK on CONT_COMPROBANTES_CONTABLES (
ID_ESTADO_COMPROBANTE
);

/*==============================================================*/
/* Table: CONT_CUENTAS                                          */
/*==============================================================*/
create table CONT_CUENTAS (
   ID_CUENTA            SERIAL               not null,
   CODIGO               TEXT                 not null,
   DESCRIPCION          TEXT                 not null,
   CUENTA_PADRE         TEXT                 null,
   ESTADO               BOOL                 not null,
   constraint PK_CONT_CUENTAS primary key (ID_CUENTA)
);

/*==============================================================*/
/* Index: CONT_CUENTAS_PK                                       */
/*==============================================================*/
create unique index CONT_CUENTAS_PK on CONT_CUENTAS (
ID_CUENTA
);

/*==============================================================*/
/* Table: CONT_CUENTAS_BANCARIAS                                */
/*==============================================================*/
create table CONT_CUENTAS_BANCARIAS (
   ID_CUENTA_BANCARIA   SERIAL               not null,
   CODIGO               TEXT                 null,
   NUMERO_CUENTA        TEXT                 null,
   SALDO                DECIMAL(7,2)         null,
   TITULAR              TEXT                 null,
   FECHA_APERTURA       DATE                 null,
   FECHA_CIERRE         DATE                 null,
   ESTADO               BOOL                 null,
   constraint PK_CONT_CUENTAS_BANCARIAS primary key (ID_CUENTA_BANCARIA)
);

/*==============================================================*/
/* Index: CONT_CUENTAS_BANCARIAS_PK                             */
/*==============================================================*/
create unique index CONT_CUENTAS_BANCARIAS_PK on CONT_CUENTAS_BANCARIAS (
ID_CUENTA_BANCARIA
);

/*==============================================================*/
/* Table: CONT_DETALLE_ASIENTOS                                 */
/*==============================================================*/
create table CONT_DETALLE_ASIENTOS (
   ID_DETALLE_ASIENTO   SERIAL               not null,
   ID_CUENTA            INT4                 not null,
   ID_ASIENTO           INT4                 not null,
   DESCRIPCION          TEXT                 null,
   DOCUMENTO            TEXT                 null,
   DEBE                 DECIMAL(12,2)        not null,
   HABER                DECIMAL(12,2)        not null,
   constraint PK_CONT_DETALLE_ASIENTOS primary key (ID_DETALLE_ASIENTO)
);

/*==============================================================*/
/* Index: DETALLE_ASIENTOS_PK                                   */
/*==============================================================*/
create unique index DETALLE_ASIENTOS_PK on CONT_DETALLE_ASIENTOS (
ID_DETALLE_ASIENTO
);

/*==============================================================*/
/* Index: RELATIONSHIP_34_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_34_FK on CONT_DETALLE_ASIENTOS (
ID_CUENTA
);

/*==============================================================*/
/* Index: RELATIONSHIP_35_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_35_FK on CONT_DETALLE_ASIENTOS (
ID_ASIENTO
);

/*==============================================================*/
/* Table: CONT_EJERCICIOS_FISCALES                              */
/*==============================================================*/
create table CONT_EJERCICIOS_FISCALES (
   ID_EJERCICIO_FISCAL  SERIAL               not null,
   CODIGO               TEXT                 not null,
   NOMBRE               TEXT                 not null,
   FECHA_INICIO         DATE                 not null,
   FECHA_FINAL          DATE                 not null,
   ESTADO               BOOL                 not null,
   constraint PK_CONT_EJERCICIOS_FISCALES primary key (ID_EJERCICIO_FISCAL)
);

/*==============================================================*/
/* Index: CONT_EJERCICIOS_FISCALES_PK                           */
/*==============================================================*/
create unique index CONT_EJERCICIOS_FISCALES_PK on CONT_EJERCICIOS_FISCALES (
ID_EJERCICIO_FISCAL
);

/*==============================================================*/
/* Table: CONT_ESTADOS_COMPROBANTES                             */
/*==============================================================*/
create table CONT_ESTADOS_COMPROBANTES (
   ID_ESTADO_COMPROBANTE SERIAL               not null,
   CODIGO               TEXT                 not null,
   DESCRIPCION          TEXT                 not null,
   OBSERVACION          TEXT                 not null,
   ESTADO               BOOL                 not null,
   constraint PK_CONT_ESTADOS_COMPROBANTES primary key (ID_ESTADO_COMPROBANTE)
);

/*==============================================================*/
/* Index: CONT_ESTADOS_COMPROBANTES_PK                          */
/*==============================================================*/
create unique index CONT_ESTADOS_COMPROBANTES_PK on CONT_ESTADOS_COMPROBANTES (
ID_ESTADO_COMPROBANTE
);

/*==============================================================*/
/* Table: CONT_FORMAS_PAGO                                      */
/*==============================================================*/
create table CONT_FORMAS_PAGO (
   ID_FORMA_PAGO        SERIAL               not null,
   CODIGO               TEXT                 not null,
   DESCRIPCION          TEXT                 not null,
   ESTADO               BOOL                 not null,
   constraint PK_CONT_FORMAS_PAGO primary key (ID_FORMA_PAGO)
);

/*==============================================================*/
/* Index: CONT_FORMA_PAGO_PK                                    */
/*==============================================================*/
create unique index CONT_FORMA_PAGO_PK on CONT_FORMAS_PAGO (
ID_FORMA_PAGO
);

/*==============================================================*/
/* Table: CONT_IVA                                              */
/*==============================================================*/
create table CONT_IVA (
   ID_IVA               SERIAL               not null,
   DESCRIPCION          TEXT                 null,
   VALOR                DECIMAL(12,2)        null,
   ESTADO               BOOL                 null,
   constraint PK_CONT_IVA primary key (ID_IVA)
);

/*==============================================================*/
/* Index: CONT_IVA_PK                                           */
/*==============================================================*/
create unique index CONT_IVA_PK on CONT_IVA (
ID_IVA
);

/*==============================================================*/
/* Table: CONT_PAGOS                                            */
/*==============================================================*/
create table CONT_PAGOS (
   ID_PAGO              SERIAL               not null,
   ID_FACTURA_COMPRA    INT4                 null,
   ID_FACTURA_VENTA     INT4                 null,
   ID_FORMA_PAGO        INT4                 null,
   FECHA_PAGO           DATE                 null,
   VALOR                DECIMAL(12,2)        null,
   OBSERVACION          TEXT                 null,
   ESTADO               BOOL                 null,
   constraint PK_CONT_PAGOS primary key (ID_PAGO)
);

/*==============================================================*/
/* Index: CONT_PAGOS_PK                                         */
/*==============================================================*/
create unique index CONT_PAGOS_PK on CONT_PAGOS (
ID_PAGO
);

/*==============================================================*/
/* Index: RELATIONSHIP_48_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_48_FK on CONT_PAGOS (
ID_FACTURA_COMPRA
);

/*==============================================================*/
/* Index: RELATIONSHIP_49_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_49_FK on CONT_PAGOS (
ID_FACTURA_VENTA
);

/*==============================================================*/
/* Index: RELATIONSHIP_50_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_50_FK on CONT_PAGOS (
ID_FORMA_PAGO
);

/*==============================================================*/
/* Table: CONT_PERIODOS_CONTABLES                               */
/*==============================================================*/
create table CONT_PERIODOS_CONTABLES (
   ID_PERIODO_CONTABLE  SERIAL               not null,
   ID_EJERCICIO_FISCAL  INT4                 null,
   CODIGO               TEXT                 not null,
   NOMBRE               TEXT                 not null,
   FECHA_INICIO         DATE                 not null,
   FECHA_FINAL          DATE                 not null,
   ESTADO               BOOL                 not null,
   constraint PK_CONT_PERIODOS_CONTABLES primary key (ID_PERIODO_CONTABLE)
);

/*==============================================================*/
/* Index: CONT_PERIODOS_CONTABLES_PK                            */
/*==============================================================*/
create unique index CONT_PERIODOS_CONTABLES_PK on CONT_PERIODOS_CONTABLES (
ID_PERIODO_CONTABLE
);

/*==============================================================*/
/* Index: RELATIONSHIP_3_FK                                     */
/*==============================================================*/
create  index RELATIONSHIP_3_FK on CONT_PERIODOS_CONTABLES (
ID_EJERCICIO_FISCAL
);

/*==============================================================*/
/* Table: CONT_TIPOS_COMPROBANTES                               */
/*==============================================================*/
create table CONT_TIPOS_COMPROBANTES (
   ID_TIPO_COMPROBANTE  SERIAL               not null,
   CODIGO               TEXT                 not null,
   DESCRIPCION          TEXT                 not null,
   SIGNO                TEXT                 not null,
   ESTADO               BOOL                 not null,
   constraint PK_CONT_TIPOS_COMPROBANTES primary key (ID_TIPO_COMPROBANTE)
);

/*==============================================================*/
/* Index: CONT_TIPOS_COMPROBANTES_PK                            */
/*==============================================================*/
create unique index CONT_TIPOS_COMPROBANTES_PK on CONT_TIPOS_COMPROBANTES (
ID_TIPO_COMPROBANTE
);

/*==============================================================*/
/* Table: INFORMACION_TRIBUTARIA                                */
/*==============================================================*/
create table INFORMACION_TRIBUTARIA (
   ID_INFORMACION_TRIBUTARIA SERIAL               not null,
   AMBIENTE             TEXT                 null,
   TIPOEMISION          TEXT                 null,
   RAZONSOCIAL          TEXT                 null,
   NOMBRECOMERCIAL      TEXT                 null,
   RUC                  TEXT                 null,
   CLAVEACCESO          TEXT                 null,
   CODDOC               TEXT                 null,
   ESTAB                TEXT                 null,
   PTOEMI               TEXT                 null,
   SECUENCIAL           TEXT                 null,
   DIRMATRIZ            TEXT                 null,
   CONTRIBUYENTERIMPE   TEXT                 null,
   constraint PK_INFORMACION_TRIBUTARIA primary key (ID_INFORMACION_TRIBUTARIA)
);

/*==============================================================*/
/* Index: INFORMACION_TRIBUTARIA_PK                             */
/*==============================================================*/
create unique index INFORMACION_TRIBUTARIA_PK on INFORMACION_TRIBUTARIA (
ID_INFORMACION_TRIBUTARIA
);

/*==============================================================*/
/* Table: INVE_CATEGORIAS                                       */
/*==============================================================*/
create table INVE_CATEGORIAS (
   ID_CATEGORIAS        SERIAL               not null,
   DESCRIPCION          TEXT                 null,
   constraint PK_INVE_CATEGORIAS primary key (ID_CATEGORIAS)
);

/*==============================================================*/
/* Index: INVE_CATEGORIAS_PK                                    */
/*==============================================================*/
create unique index INVE_CATEGORIAS_PK on INVE_CATEGORIAS (
ID_CATEGORIAS
);

/*==============================================================*/
/* Table: INVE_ICE                                              */
/*==============================================================*/
create table INVE_ICE (
   ID_ICE               SERIAL               not null,
   DESCRIPCION          TEXT                 null,
   VALOR                DECIMAL(12,2)        null,
   ESTADO               BOOL                 null,
   constraint PK_INVE_ICE primary key (ID_ICE)
);

/*==============================================================*/
/* Index: INVE_ICE_PK                                           */
/*==============================================================*/
create unique index INVE_ICE_PK on INVE_ICE (
ID_ICE
);

/*==============================================================*/
/* Table: INVE_PACKS                                            */
/*==============================================================*/
create table INVE_PACKS (
   ID_PACK              SERIAL               not null,
   NOMBRE               TEXT                 not null,
   DESCRIPCION          TEXT                 not null,
   ESTADO               BOOL                 not null,
   constraint PK_INVE_PACKS primary key (ID_PACK)
);

/*==============================================================*/
/* Index: INVE_PACKS_PK                                         */
/*==============================================================*/
create unique index INVE_PACKS_PK on INVE_PACKS (
ID_PACK
);

/*==============================================================*/
/* Table: INVE_PRECIOS                                          */
/*==============================================================*/
create table INVE_PRECIOS (
   ID_PRECIO            SERIAL               not null,
   ID_PRODUCTO          INT4                 null,
   PRECIO               DECIMAL(12,2)        null,
   UTILIDAD             DECIMAL(12,2)        null,
   constraint PK_INVE_PRECIOS primary key (ID_PRECIO)
);

/*==============================================================*/
/* Index: INVE_PRECIOS_PK                                       */
/*==============================================================*/
create unique index INVE_PRECIOS_PK on INVE_PRECIOS (
ID_PRECIO
);

/*==============================================================*/
/* Index: RELATIONSHIP_44_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_44_FK on INVE_PRECIOS (
ID_PRODUCTO
);

/*==============================================================*/
/* Table: INVE_PRODUCTOS                                        */
/*==============================================================*/
create table INVE_PRODUCTOS (
   ID_PRODUCTO          SERIAL               not null,
   ID_TIPO_INVENTARIO   INT4                 null,
   ID_CATEGORIAS        INT4                 null,
   ID_UNIDAD            INT4                 null,
   ID_ICE               INT4                 null,
   CODIGO               TEXT                 not null,
   DESCRIPCION          TEXT                 not null,
   ESPECIFICACIONES     TEXT                 null,
   STOCK                DECIMAL(12,2)        not null,
   STOCK_MINIMO         DECIMAL(12,2)        not null,
   STOCK_MAXIMO         DECIMAL(12,2)        not null,
   IVA                  BOOL                 null,
   ESTADO               BOOL                 not null,
   constraint PK_INVE_PRODUCTOS primary key (ID_PRODUCTO)
);

/*==============================================================*/
/* Index: INVE_PRODUCTOS_PK                                     */
/*==============================================================*/
create unique index INVE_PRODUCTOS_PK on INVE_PRODUCTOS (
ID_PRODUCTO
);

/*==============================================================*/
/* Index: RELATIONSHIP_42_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_42_FK on INVE_PRODUCTOS (
ID_TIPO_INVENTARIO
);

/*==============================================================*/
/* Index: RELATIONSHIP_45_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_45_FK on INVE_PRODUCTOS (
ID_CATEGORIAS
);

/*==============================================================*/
/* Index: RELATIONSHIP_47_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_47_FK on INVE_PRODUCTOS (
ID_UNIDAD
);

/*==============================================================*/
/* Index: RELATIONSHIP_46_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_46_FK on INVE_PRODUCTOS (
ID_ICE
);

/*==============================================================*/
/* Table: INVE_PRODUCTOS_PACKS                                  */
/*==============================================================*/
create table INVE_PRODUCTOS_PACKS (
   ID_PRODUCTO_PACK     SERIAL               not null,
   ID_PACK              INT4                 null,
   ID_PRODUCTO          INT4                 null,
   CANTIDAD             TEXT                 not null,
   ESTADO               BOOL                 not null,
   constraint PK_INVE_PRODUCTOS_PACKS primary key (ID_PRODUCTO_PACK)
);

/*==============================================================*/
/* Index: INVE_PRODUCTOS_PACKS_PK                               */
/*==============================================================*/
create unique index INVE_PRODUCTOS_PACKS_PK on INVE_PRODUCTOS_PACKS (
ID_PRODUCTO_PACK
);

/*==============================================================*/
/* Index: RELATIONSHIP_16_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_16_FK on INVE_PRODUCTOS_PACKS (
ID_PACK
);

/*==============================================================*/
/* Index: RELATIONSHIP_17_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_17_FK on INVE_PRODUCTOS_PACKS (
ID_PRODUCTO
);

/*==============================================================*/
/* Table: INVE_TIPOS_INVENTARIOS                                */
/*==============================================================*/
create table INVE_TIPOS_INVENTARIOS (
   ID_TIPO_INVENTARIO   SERIAL               not null,
   DESCRIPCION          TEXT                 null,
   ESTADO               BOOL                 null,
   constraint PK_INVE_TIPOS_INVENTARIOS primary key (ID_TIPO_INVENTARIO)
);

/*==============================================================*/
/* Index: INVE_TIPOS_INVENTARIOS_PK                             */
/*==============================================================*/
create unique index INVE_TIPOS_INVENTARIOS_PK on INVE_TIPOS_INVENTARIOS (
ID_TIPO_INVENTARIO
);

/*==============================================================*/
/* Table: INVE_UNIDADES                                         */
/*==============================================================*/
create table INVE_UNIDADES (
   ID_UNIDAD            SERIAL               not null,
   DESCRIPCION          TEXT                 null,
   constraint PK_INVE_UNIDADES primary key (ID_UNIDAD)
);

/*==============================================================*/
/* Index: INVE_UNIDADES_PK                                      */
/*==============================================================*/
create unique index INVE_UNIDADES_PK on INVE_UNIDADES (
ID_UNIDAD
);

/*==============================================================*/
/* Table: SEC_ROLES                                             */
/*==============================================================*/
create table SEC_ROLES (
   ID                   SERIAL               not null,
   NOMBRE               TEXT                 not null,
   DESCRIPCION          TEXT                 null,
   PERMISOS             TEXT                 null,
   ESTADO               BOOL                 not null,
   constraint PK_SEC_ROLES primary key (ID)
);

/*==============================================================*/
/* Index: SEC_ROLES_PK                                          */
/*==============================================================*/
create unique index SEC_ROLES_PK on SEC_ROLES (
ID
);

/*==============================================================*/
/* Table: SEC_USERS                                             */
/*==============================================================*/
create table SEC_USERS (
   ID                   SERIAL               not null,
   SEC_ID               INT4                 null,
   NOMBRE               TEXT                 not null,
   APELLIDO             TEXT                 null,
   EMAIL                TEXT                 not null,
   PASSWORD             TEXT                 not null,
   IMG                  TEXT                 null,
   ESTADO               BOOL                 not null,
   constraint PK_SEC_USERS primary key (ID)
);

/*==============================================================*/
/* Index: SEC_USERS_PK                                          */
/*==============================================================*/
create unique index SEC_USERS_PK on SEC_USERS (
ID
);

/*==============================================================*/
/* Index: RELATIONSHIP_28_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_28_FK on SEC_USERS (
SEC_ID
);

/*==============================================================*/
/* Table: VENT_CLIENTES                                         */
/*==============================================================*/
create table VENT_CLIENTES (
   ID_CLIENTE           SERIAL               not null,
   ID_GRUPO_CLIENTE     INT4                 null,
   IDENTIFICACION       TEXT                 not null,
   NOMBRE               TEXT                 not null,
   APELLIDO             TEXT                 not null,
   DIRECCION            TEXT                 not null,
   TELEFONO             TEXT                 not null,
   EMAIL                TEXT                 not null,
   ESTADO               BOOL                 not null,
   constraint PK_VENT_CLIENTES primary key (ID_CLIENTE)
);

/*==============================================================*/
/* Index: VENT_CLIENTES_PK                                      */
/*==============================================================*/
create unique index VENT_CLIENTES_PK on VENT_CLIENTES (
ID_CLIENTE
);

/*==============================================================*/
/* Index: RELATIONSHIP_41_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_41_FK on VENT_CLIENTES (
ID_GRUPO_CLIENTE
);

/*==============================================================*/
/* Table: VENT_DETALLE_FACTURAS_VENTAS                          */
/*==============================================================*/
create table VENT_DETALLE_FACTURAS_VENTAS (
   ID_DETALLE_FACTURA_VENTA SERIAL               not null,
   ID_PRODUCTO          INT4                 null,
   ID_PACK              INT4                 null,
   ID_FACTURA_VENTA     INT4                 null,
   CODIGO_PRINCIPAL     TEXT                 not null,
   DETALLE_ADICIONAL    TEXT                 null,
   CANTIDAD             DECIMAL(12,6)        not null,
   DESCRIPCION          TEXT                 not null,
   PRECIO_UNITARIO      DECIMAL(12,6)        not null,
   SUBSIDIO             DECIMAL(12,2)        null,
   PRECIO_SIN_SUBSIDIO  DECIMAL(12,2)        null,
   DESCUENTO            DECIMAL(12,2)        null,
   CODIGO_AUXILIAR      TEXT                 null,
   PRECIO_TOTAL         DECIMAL(12,2)        not null,
   constraint PK_VENT_DETALLE_FACTURAS_VENTA primary key (ID_DETALLE_FACTURA_VENTA)
);

/*==============================================================*/
/* Index: VENT_DETALLE_FACTURAS_VENTAS_PK                       */
/*==============================================================*/
create unique index VENT_DETALLE_FACTURAS_VENTAS_PK on VENT_DETALLE_FACTURAS_VENTAS (
ID_DETALLE_FACTURA_VENTA
);

/*==============================================================*/
/* Index: RELATIONSHIP_29_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_29_FK on VENT_DETALLE_FACTURAS_VENTAS (
ID_PRODUCTO
);

/*==============================================================*/
/* Index: RELATIONSHIP_30_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_30_FK on VENT_DETALLE_FACTURAS_VENTAS (
ID_PACK
);

/*==============================================================*/
/* Index: RELATIONSHIP_21_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_21_FK on VENT_DETALLE_FACTURAS_VENTAS (
ID_FACTURA_VENTA
);

/*==============================================================*/
/* Table: VENT_FACTURAS_VENTAS                                  */
/*==============================================================*/
create table VENT_FACTURAS_VENTAS (
   ID_FACTURA_VENTA     SERIAL               not null,
   ID_CLIENTE           INT4                 null,
   ID_FORMA_PAGO        INT4                 null,
   ID_CUENTA            INT4                 null,
   ID_ASIENTO           INT4                 null,
   ID_IVA               INT4                 null,
   CODIGO               TEXT                 not null,
   FECHA_EMISION        DATE                 not null,
   FECHA_VENCIMIENTO    DATE                 null,
   ESTADO_PAGO          TEXT                 null,
   SUBTOTAL_SIN_IMPUESTOS DECIMAL(12,2)        not null,
   TOTAL_DESCUENTO      DECIMAL(12,2)        not null,
   IVA                  DECIMAL(12,2)        not null,
   VALOR_TOTAL          DECIMAL(12,2)        not null,
   ABONO                DECIMAL(12,2)        null,
   ESTADO               BOOL                 null,
   constraint PK_VENT_FACTURAS_VENTAS primary key (ID_FACTURA_VENTA)
);

/*==============================================================*/
/* Index: VENT_FACTURAS_VENTAS_PK                               */
/*==============================================================*/
create unique index VENT_FACTURAS_VENTAS_PK on VENT_FACTURAS_VENTAS (
ID_FACTURA_VENTA
);

/*==============================================================*/
/* Index: RELATIONSHIP_26_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_26_FK on VENT_FACTURAS_VENTAS (
ID_CLIENTE
);

/*==============================================================*/
/* Index: RELATIONSHIP_27_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_27_FK on VENT_FACTURAS_VENTAS (
ID_FORMA_PAGO
);

/*==============================================================*/
/* Index: RELATIONSHIP_33_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_33_FK on VENT_FACTURAS_VENTAS (
ID_CUENTA
);

/*==============================================================*/
/* Index: RELATIONSHIP_37_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_37_FK on VENT_FACTURAS_VENTAS (
ID_ASIENTO
);

/*==============================================================*/
/* Index: RELATIONSHIP_54_FK                                    */
/*==============================================================*/
create  index RELATIONSHIP_54_FK on VENT_FACTURAS_VENTAS (
ID_IVA
);

/*==============================================================*/
/* Table: VENT_GRUPOS_CLIENTES                                  */
/*==============================================================*/
create table VENT_GRUPOS_CLIENTES (
   ID_GRUPO_CLIENTE     SERIAL               not null,
   DESCRIPCION          TEXT                 null,
   PORCENTAJE           DECIMAL(12,2)        null,
   constraint PK_VENT_GRUPOS_CLIENTES primary key (ID_GRUPO_CLIENTE)
);

/*==============================================================*/
/* Index: VENT_GRUPOS_CLIENTES_PK                               */
/*==============================================================*/
create unique index VENT_GRUPOS_CLIENTES_PK on VENT_GRUPOS_CLIENTES (
ID_GRUPO_CLIENTE
);

alter table APU_MATERIALES
   add constraint FK_APU_MATE_RELATIONS_APU_APU foreign key (ID_APU)
      references APU_APU (ID_APU)
      on delete restrict on update restrict;

alter table APU_MATERIALES
   add constraint FK_APU_MATE_RELATIONS_INVE_PRO foreign key (ID_PRODUCTO)
      references INVE_PRODUCTOS (ID_PRODUCTO)
      on delete restrict on update restrict;

alter table APU_TRABAJO
   add constraint FK_APU_TRAB_RELATIONS_APU_APU foreign key (ID_APU)
      references APU_APU (ID_APU)
      on delete restrict on update restrict;

alter table APU_TRANSPORTE
   add constraint FK_APU_TRAN_RELATIONS_APU_APU foreign key (ID_APU)
      references APU_APU (ID_APU)
      on delete restrict on update restrict;

alter table COMP_DETALLE_FACTURAS_COMPRAS
   add constraint FK_COMP_DET_RELATIONS_COMP_FAC foreign key (ID_FACTURA_COMPRA)
      references COMP_FACTURAS_COMPRAS (ID_FACTURA_COMPRA)
      on delete restrict on update restrict;

alter table COMP_DETALLE_FACTURAS_COMPRAS
   add constraint FK_COMP_DET_RELATIONS_INVE_PRO foreign key (ID_PRODUCTO)
      references INVE_PRODUCTOS (ID_PRODUCTO)
      on delete restrict on update restrict;

alter table COMP_FACTURAS_COMPRAS
   add constraint FK_COMP_FAC_RELATIONS_COMP_PRO foreign key (ID_PROVEEDOR)
      references COMP_PROVEEDORES (ID_PROVEEDOR)
      on delete restrict on update restrict;

alter table COMP_FACTURAS_COMPRAS
   add constraint FK_COMP_FAC_RELATIONS_CONT_CUE foreign key (ID_CUENTA)
      references CONT_CUENTAS (ID_CUENTA)
      on delete restrict on update restrict;

alter table COMP_FACTURAS_COMPRAS
   add constraint FK_COMP_FAC_RELATIONS_CONT_FOR foreign key (ID_FORMA_PAGO)
      references CONT_FORMAS_PAGO (ID_FORMA_PAGO)
      on delete restrict on update restrict;

alter table COMP_FACTURAS_COMPRAS
   add constraint FK_COMP_FAC_RELATIONS_CONT_ASI foreign key (ID_ASIENTO)
      references CONT_ASIENTOS (ID_ASIENTO)
      on delete restrict on update restrict;

alter table COMP_FACTURAS_COMPRAS
   add constraint FK_COMP_FAC_RELATIONS_CONT_IVA foreign key (ID_IVA)
      references CONT_IVA (ID_IVA)
      on delete restrict on update restrict;

alter table CONT_COMPROBANTES_CONTABLES
   add constraint FK_CONT_COM_RELATIONS_CONT_EJE foreign key (ID_EJERCICIO_FISCAL)
      references CONT_EJERCICIOS_FISCALES (ID_EJERCICIO_FISCAL)
      on delete restrict on update restrict;

alter table CONT_COMPROBANTES_CONTABLES
   add constraint FK_CONT_COM_RELATIONS_CONT_TIP foreign key (ID_TIPO_COMPROBANTE)
      references CONT_TIPOS_COMPROBANTES (ID_TIPO_COMPROBANTE)
      on delete restrict on update restrict;

alter table CONT_COMPROBANTES_CONTABLES
   add constraint FK_CONT_COM_RELATIONS_CONT_EST foreign key (ID_ESTADO_COMPROBANTE)
      references CONT_ESTADOS_COMPROBANTES (ID_ESTADO_COMPROBANTE)
      on delete restrict on update restrict;

alter table CONT_DETALLE_ASIENTOS
   add constraint FK_CONT_DET_RELATIONS_CONT_CUE foreign key (ID_CUENTA)
      references CONT_CUENTAS (ID_CUENTA)
      on delete restrict on update restrict;

alter table CONT_DETALLE_ASIENTOS
   add constraint FK_CONT_DET_RELATIONS_CONT_ASI foreign key (ID_ASIENTO)
      references CONT_ASIENTOS (ID_ASIENTO)
      on delete restrict on update restrict;

alter table CONT_PAGOS
   add constraint FK_CONT_PAG_RELATIONS_COMP_FAC foreign key (ID_FACTURA_COMPRA)
      references COMP_FACTURAS_COMPRAS (ID_FACTURA_COMPRA)
      on delete restrict on update restrict;

alter table CONT_PAGOS
   add constraint FK_CONT_PAG_RELATIONS_VENT_FAC foreign key (ID_FACTURA_VENTA)
      references VENT_FACTURAS_VENTAS (ID_FACTURA_VENTA)
      on delete restrict on update restrict;

alter table CONT_PAGOS
   add constraint FK_CONT_PAG_RELATIONS_CONT_FOR foreign key (ID_FORMA_PAGO)
      references CONT_FORMAS_PAGO (ID_FORMA_PAGO)
      on delete restrict on update restrict;

alter table CONT_PERIODOS_CONTABLES
   add constraint FK_CONT_PER_RELATIONS_CONT_EJE foreign key (ID_EJERCICIO_FISCAL)
      references CONT_EJERCICIOS_FISCALES (ID_EJERCICIO_FISCAL)
      on delete restrict on update restrict;

alter table INVE_PRECIOS
   add constraint FK_INVE_PRE_RELATIONS_INVE_PRO foreign key (ID_PRODUCTO)
      references INVE_PRODUCTOS (ID_PRODUCTO)
      on delete restrict on update restrict;

alter table INVE_PRODUCTOS
   add constraint FK_INVE_PRO_RELATIONS_INVE_TIP foreign key (ID_TIPO_INVENTARIO)
      references INVE_TIPOS_INVENTARIOS (ID_TIPO_INVENTARIO)
      on delete restrict on update restrict;

alter table INVE_PRODUCTOS
   add constraint FK_INVE_PRO_RELATIONS_INVE_CAT foreign key (ID_CATEGORIAS)
      references INVE_CATEGORIAS (ID_CATEGORIAS)
      on delete restrict on update restrict;

alter table INVE_PRODUCTOS
   add constraint FK_INVE_PRO_RELATIONS_INVE_ICE foreign key (ID_ICE)
      references INVE_ICE (ID_ICE)
      on delete restrict on update restrict;

alter table INVE_PRODUCTOS
   add constraint FK_INVE_PRO_RELATIONS_INVE_UNI foreign key (ID_UNIDAD)
      references INVE_UNIDADES (ID_UNIDAD)
      on delete restrict on update restrict;

alter table INVE_PRODUCTOS_PACKS
   add constraint FK_INVE_PRO_RELATIONS_INVE_PAC foreign key (ID_PACK)
      references INVE_PACKS (ID_PACK)
      on delete restrict on update restrict;

alter table INVE_PRODUCTOS_PACKS
   add constraint FK_INVE_PRO_RELATIONS_INVE_PRO foreign key (ID_PRODUCTO)
      references INVE_PRODUCTOS (ID_PRODUCTO)
      on delete restrict on update restrict;

alter table SEC_USERS
   add constraint FK_SEC_USER_RELATIONS_SEC_ROLE foreign key (SEC_ID)
      references SEC_ROLES (ID)
      on delete restrict on update restrict;

alter table VENT_CLIENTES
   add constraint FK_VENT_CLI_RELATIONS_VENT_GRU foreign key (ID_GRUPO_CLIENTE)
      references VENT_GRUPOS_CLIENTES (ID_GRUPO_CLIENTE)
      on delete restrict on update restrict;

alter table VENT_DETALLE_FACTURAS_VENTAS
   add constraint FK_VENT_DET_RELATIONS_VENT_FAC foreign key (ID_FACTURA_VENTA)
      references VENT_FACTURAS_VENTAS (ID_FACTURA_VENTA)
      on delete restrict on update restrict;

alter table VENT_DETALLE_FACTURAS_VENTAS
   add constraint FK_VENT_DET_RELATIONS_INVE_PRO foreign key (ID_PRODUCTO)
      references INVE_PRODUCTOS (ID_PRODUCTO)
      on delete restrict on update restrict;

alter table VENT_DETALLE_FACTURAS_VENTAS
   add constraint FK_VENT_DET_RELATIONS_INVE_PAC foreign key (ID_PACK)
      references INVE_PACKS (ID_PACK)
      on delete restrict on update restrict;

alter table VENT_FACTURAS_VENTAS
   add constraint FK_VENT_FAC_RELATIONS_VENT_CLI foreign key (ID_CLIENTE)
      references VENT_CLIENTES (ID_CLIENTE)
      on delete restrict on update restrict;

alter table VENT_FACTURAS_VENTAS
   add constraint FK_VENT_FAC_RELATIONS_CONT_FOR foreign key (ID_FORMA_PAGO)
      references CONT_FORMAS_PAGO (ID_FORMA_PAGO)
      on delete restrict on update restrict;

alter table VENT_FACTURAS_VENTAS
   add constraint FK_VENT_FAC_RELATIONS_CONT_CUE foreign key (ID_CUENTA)
      references CONT_CUENTAS (ID_CUENTA)
      on delete restrict on update restrict;

alter table VENT_FACTURAS_VENTAS
   add constraint FK_VENT_FAC_RELATIONS_CONT_ASI foreign key (ID_ASIENTO)
      references CONT_ASIENTOS (ID_ASIENTO)
      on delete restrict on update restrict;

alter table VENT_FACTURAS_VENTAS
   add constraint FK_VENT_FAC_RELATIONS_CONT_IVA foreign key (ID_IVA)
      references CONT_IVA (ID_IVA)
      on delete restrict on update restrict;

