DROP TABLE IF EXISTS "quo_details";
DROP TABLE IF EXISTS "pur_details";
DROP TABLE IF EXISTS "pur_headers";
DROP TABLE IF EXISTS "quo_headers";
DROP TABLE IF EXISTS "sal_clients";
DROP TABLE IF EXISTS "sal_group_clients";
DROP TABLE IF EXISTS "pur_providers";
DROP TABLE IF EXISTS "inv_prices";
DROP TABLE IF EXISTS "inv_products";
DROP TABLE IF EXISTS "pur_iva";
DROP TABLE IF EXISTS "inv_units";
DROP TABLE IF EXISTS "inv_categories";
DROP TABLE IF EXISTS "sec_users";
DROP TABLE IF EXISTS "sec_roles";

CREATE TABLE sec_roles (
    id SERIAL  PRIMARY KEY ,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255),
	  estado boolean,
    permisos VARCHAR(255) NOT NULL
);

INSERT INTO sec_roles (nombre, descripcion, estado, permisos) VALUES ('ROL_ADMIN','Admin', true, 'Todos');
INSERT INTO sec_roles (nombre, descripcion, estado, permisos) VALUES ('ROL_USER','Usuario', true, 'Todos');
INSERT INTO sec_roles (nombre, descripcion, estado, permisos) VALUES ('ROL_BODEG','Bodeguero', true, 'Todos');

CREATE TABLE sec_users (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50),
  apellido VARCHAR(50),
  email VARCHAR(100),
  password VARCHAR(100),
  img VARCHAR(100),
  estado BOOLEAN ,
  rol_id INT 
);

ALTER TABLE sec_users ADD CONSTRAINT fk_rol_id FOREIGN KEY (rol_id) REFERENCES sec_roles(id);



INSERT INTO sec_users (nombre, apellido, email, password, img, estado, rol_id) VALUES
  ('Super', 'Admin', 'admin@admin.com', '$2a$10$zyrUdVaTP98dvzWM4GUrtOhvNl6I32B3.S8ICc/EPhc.6ZKGh9d4a', 'profile.jpg', TRUE,1),
  ('Leonardo', 'DiCaprio', 'leo@example.com', '$2a$10$zyrUdVaTP98dvzWM4GUrtOhvNl6I32B3.S8ICc/EPhc.6ZKGh9d4a', 'leo.jpg', TRUE, 2),
  ('Jennifer', 'Lawrence', 'jennifer@example.com', '$2a$10$zyrUdVaTP98dvzWM4GUrtOhvNl6I32B3.S8ICc/EPhc.6ZKGh9d4a', 'jennifer.jpg', TRUE, 3),
  ('Tom', 'Hanks', 'tom@example.com', '$2a$10$zyrUdVaTP98dvzWM4GUrtOhvNl6I32B3.S8ICc/EPhc.6ZKGh9d4a', 'tom.jpg', TRUE, 2),
  ('Emma', 'Watson', 'emma@example.com', '$2a$10$zyrUdVaTP98dvzWM4GUrtOhvNl6I32B3.S8ICc/EPhc.6ZKGh9d4a', 'emma.jpg', TRUE, 3),
  ('Brad', 'Pitt', 'brad@example.com', '$2a$10$zyrUdVaTP98dvzWM4GUrtOhvNl6I32B3.S8ICc/EPhc.6ZKGh9d4a', 'brad.jpg', TRUE, 2),
  ('Angelina', 'Jolie', 'angelina@example.com', '$2a$10$zyrUdVaTP98dvzWM4GUrtOhvNl6I32B3.S8ICc/EPhc.6ZKGh9d4a', 'angelina.jpg', TRUE, 3),
  ('Robert', 'Downey Jr.', 'robert@example.com', '$2a$10$zyrUdVaTP98dvzWM4GUrtOhvNl6I32B3.S8ICc/EPhc.6ZKGh9d4a', 'robert.jpg', TRUE, 2),
  ('Scarlett', 'Johansson', 'scarlett@example.com', '$2a$10$zyrUdVaTP98dvzWM4GUrtOhvNl6I32B3.S8ICc/EPhc.6ZKGh9d4a', 'scarlett.jpg', TRUE, 3),
  ('Johnny', 'Depp', 'johnny@example.com', '$2a$10$zyrUdVaTP98dvzWM4GUrtOhvNl6I32B3.S8ICc/EPhc.6ZKGh9d4a', 'johnny.jpg', TRUE, 2),
  ('Meryl', 'Streep', 'meryl@example.com', '$2a$10$zyrUdVaTP98dvzWM4GUrtOhvNl6I32B3.S8ICc/EPhc.6ZKGh9d4a', 'meryl.jpg', TRUE, 3);



CREATE TABLE "inv_categories" (
  "id" serial PRIMARY KEY,
  "name" varchar(255),
  "status" boolean
);

CREATE TABLE "inv_units" (
  "id" serial PRIMARY KEY,
  "name_units" varchar(255),
  "status" boolean
);

CREATE TABLE "inv_products" (
  "id" serial PRIMARY KEY,
  "sku" varchar(255),
  "name" varchar(255),
  "description" varchar(255),
  "specifications" varchar(255),
  "id_category" int,
  "pur_price" numeric(8,2),
  "id_iva" int,
  "status" boolean,
  "id_unit" int,
  "mini_stock" int,
  "stock" int
);

CREATE TABLE "inv_prices" (
  "id" serial PRIMARY KEY,
  "id_product" int,
  "price" numeric(8,2)
);

CREATE TABLE "pur_iva" (
  "id" serial PRIMARY KEY,
  "worth" int,
  "status" boolean
);

CREATE TABLE "pur_providers" (
  "id" serial PRIMARY KEY,
  "ruc" varchar,
  "trade_name" varchar(255),
  "representative" varchar(255),
  "address" varchar(255),
  "phone" varchar(255),
  "email" varchar(255),
  "status" boolean
);

CREATE TABLE "pur_headers" (
  "id" serial PRIMARY KEY,
  "date_buy" date,
  "code_buy" varchar(255),
  "img" varchar(255),
  "id_supplier" int,
  "status" boolean
);

CREATE TABLE "pur_details" (
  "id" serial PRIMARY KEY,
  "id_pur_header" int,
  "id_product" int,
  "amount_product" int,
  "description_product" varchar(255),
  "iva_product" numeric(8,2),
  "price_product" numeric(8,2)
);

CREATE TABLE "sal_group_clients" (
  "id" serial PRIMARY KEY,
  "name" varchar(255)
);

CREATE TABLE "sal_clients" (
  "id" serial PRIMARY KEY,
  "ci" varchar(255),
  "name" varchar,
  "lastname" varchar(255),
  "address" varchar(255),
  "phone" varchar(255),
  "email" varchar(255),
  "id_group_cli" integer,
  "status" boolean
);

CREATE TABLE "quo_headers" (
  "id" serial PRIMARY KEY,
  "date_quo" date,
  "code_quo" varchar(255),
  "id_client" integer,
  "id_iva" integer,
  "created" varchar,
  "status" boolean
  
);

CREATE TABLE "quo_details" (
  "id" serial PRIMARY KEY,
  "id_quo_header" int,
  "id_product" int,
  "amount_product" int,
  "description_product" varchar(255),
  "iva_product" numeric(8,2),
  "price_product" numeric(8,2)
);

CREATE TABLE "apu_header" (
  "id" serial PRIMARY KEY,
  "date_apu" date,
  "meters" numeric(8,2),
  "place" varchar(255),
  "percentage" numeric,
  "created" varchar(255),
  "total" numeric(12,2)
);

CREATE TABLE "apu_materials" (
  "id" serial PRIMARY KEY,
  "id_apu_header" integer,
  "id_product" integer,
  "quality" numeric,
  "price" numeric(12,2)
);

CREATE TABLE "apu_transport" (
  "id" serial PRIMARY KEY,
  "id_apu_header" integer,
  "name" varchar,
  "price" numeric(12,2)
);

CREATE TABLE "apu_labour" (
  "id" serial PRIMARY KEY,
  "id_apu_header" integer,
  "name" varchar(255),
  "quality" numeric,
  "price" numeric(12,2)
);

ALTER TABLE "sec_users" ADD FOREIGN KEY ("rol_id") REFERENCES "sec_roles" ("id");

ALTER TABLE "inv_products" ADD FOREIGN KEY ("id_unit") REFERENCES "inv_units" ("id");

ALTER TABLE "inv_products" ADD FOREIGN KEY ("id_category") REFERENCES "inv_categories" ("id");

ALTER TABLE "inv_products" ADD FOREIGN KEY ("id_iva") REFERENCES "pur_iva" ("id");

ALTER TABLE "inv_prices" ADD FOREIGN KEY ("id_product") REFERENCES "inv_products" ("id");

ALTER TABLE "pur_details" ADD FOREIGN KEY ("id_pur_header") REFERENCES "pur_headers" ("id");

ALTER TABLE "pur_details" ADD FOREIGN KEY ("id_product") REFERENCES "inv_products" ("id");

ALTER TABLE "pur_headers" ADD FOREIGN KEY ("id_supplier") REFERENCES "pur_providers" ("id");

ALTER TABLE "sal_clients" ADD FOREIGN KEY ("id_group_cli") REFERENCES "sal_group_clients" ("id");

ALTER TABLE "quo_details" ADD FOREIGN KEY ("id_quo_header") REFERENCES "quo_headers" ("id");

ALTER TABLE "quo_details" ADD FOREIGN KEY ("id_product") REFERENCES "inv_products" ("id");


ALTER TABLE "apu_materials" ADD FOREIGN KEY ("id_apu_header") REFERENCES "apu_header" ("id");

ALTER TABLE "apu_materials" ADD FOREIGN KEY ("id_product") REFERENCES "inv_products" ("id");

ALTER TABLE "apu_transport" ADD FOREIGN KEY ("id_apu_header") REFERENCES "apu_header" ("id");

ALTER TABLE "apu_labour" ADD FOREIGN KEY ("id_apu_header") REFERENCES "apu_header" ("id");

INSERT INTO "inv_units" ("name_units","status") VALUES
  ('Unidad',TRUE),
  ('Metro cuadrado',TRUE),
  ('Metro cúbico',TRUE),
  ('Kilogramo',TRUE),
  ('Litro',TRUE),
  ('Pieza',TRUE),
  ('Rollo',TRUE),
  ('Paquete',TRUE),
  ('Bolsa',TRUE),
  ('Caja',TRUE);
  
  INSERT INTO "pur_iva" ("worth","status") VALUES
  (14,TRUE),
  (12,TRUE),
  (16,TRUE),
  (18,TRUE),
  (20,TRUE),
  (22,TRUE),
  (24,TRUE),
  (26,TRUE),
  (28,TRUE),
  (30,TRUE);
  
  INSERT INTO "inv_categories" ("name","status") VALUES
  ('Materiales de construcción',TRUE),
  ('Herramientas de construcción',TRUE),
  ('Equipos de protección personal',TRUE),
  ('Pinturas y recubrimientos',TRUE),
  ('Iluminación y cables eléctricos',TRUE),
  ('Fontanería y saneamiento',TRUE),
  ('Carpintería y muebles',TRUE),
  ('Sistemas de climatización',TRUE),
  ('Materiales de acabado',TRUE),
  ('Maquinaria y equipos de construcción',TRUE);

INSERT INTO "inv_products" ("sku", "name", "description", "specifications", "id_category", "pur_price", "id_iva", "status", "id_unit", "mini_stock", "stock") VALUES
  ('INV001', 'Invernadero de cristal grande', 'Invernadero de cristal para cultivo de plantas grandes', 'Especificaciones: Dimensiones - 10m x 20m x 4m, Material - Vidrio templado, Capacidad - 200m²', 1, 5000.00, 1, true, 2, 10, 50),
  ('INV002', 'Invernadero de policarbonato mediano', 'Invernadero de policarbonato para cultivo de plantas medianas', 'Especificaciones: Dimensiones - 8m x 12m x 3m, Material - Policarbonato resistente, Capacidad - 96m²', 2, 3000.00, 1, true, 2, 8, 30),
  ('INV003', 'Invernadero de plástico pequeño', 'Invernadero de plástico para cultivo de plantas pequeñas', 'Especificaciones: Dimensiones - 6m x 8m x 2m, Material - Plástico reforzado, Capacidad - 48m²', 3, 1500.00, 1, true, 2, 5, 20),
  ('INV004', 'Invernadero tipo túnel grande', 'Invernadero tipo túnel para cultivo intensivo', 'Especificaciones: Dimensiones - 12m x 30m x 5m, Material - Estructura de acero, Capacidad - 360m²', 4, 8000.00, 1, true, 2, 12, 60),
  ('INV005', 'Invernadero de madera modular', 'Invernadero modular de madera para jardinería', 'Especificaciones: Dimensiones - 4m x 6m x 2.5m, Material - Madera tratada, Capacidad - 24m²', 5, 2000.00, 1, true, 2, 4, 15),
  ('INV006', 'Invernadero de acero hidropónico', 'Invernadero de acero para cultivo hidropónico', 'Especificaciones: Dimensiones - 10m x 10m x 3.5m, Material - Estructura de acero galvanizado, Capacidad - 100m²', 6, 4000.00, 1, true, 2, 10, 40),
  ('INV007', 'Invernadero de bambú artesanal', 'Invernadero de bambú para cultivo ecológico', 'Especificaciones: Dimensiones - 6m x 6m x 2.5m, Material - Bambú natural, Capacidad - 36m²', 7, 2500.00, 1, true, 2, 6, 25),
  ('INV008', 'Invernadero modular resistente', 'Invernadero modular de alta resistencia', 'Especificaciones: Dimensiones - 8m x 10m x 3m, Material - Estructura metálica, Capacidad - 80m²', 8, 3500.00, 1, true, 2, 8, 35),
  ('INV009', 'Invernadero hidropónico automatizado', 'Invernadero hidropónico con sistema de riego automatizado', 'Especificaciones: Dimensiones - 12m x 20m x 4m, Material - Estructura de acero, Capacidad - 240m²', 9, 6000.00, 1, true, 2, 12, 50),
  ('INV010', 'Invernadero de sombra ajustable', 'Invernadero con sistema de sombra ajustable', 'Especificaciones: Dimensiones - 10m x 15m x 3m, Material - Estructura de aluminio, Capacidad - 150m²', 10, 4500.00, 1, true, 2, 10, 45);

INSERT INTO "inv_prices" ("id_product", "price") VALUES
  (1, 5500.00),
  (2, 3500.00),
  (3, 1800.00),
  (4, 9000.00),
  (5, 2500.00),
  (6, 4500.00),
  (7, 2000.00),
  (8,300.00);


INSERT INTO "pur_providers" ("ruc", "trade_name", "representative", "address", "phone", "email", "status") VALUES
  ('1234567890', 'Proveedor Invernaderos A', 'Representante A', 'Calle Proveedor A #123', '1234567890', 'proveedorA@example.com', true),
  ('0987654321', 'Proveedor Invernaderos B', 'Representante B', 'Calle Proveedor B #456', '0987654321', 'proveedorB@example.com', true),
  ('1357924680', 'Proveedor Invernaderos C', 'Representante C', 'Calle Proveedor C #789', '1357924680', 'proveedorC@example.com', true),
  ('2468135790', 'Proveedor Invernaderos D', 'Representante D', 'Calle Proveedor D #012', '2468135790', 'proveedorD@example.com', true),
  ('9876543210', 'Proveedor Invernaderos E', 'Representante E', 'Calle Proveedor E #345', '9876543210', 'proveedorE@example.com', true),
  ('0123456789', 'Proveedor Invernaderos F', 'Representante F', 'Calle Proveedor F #678', '0123456789', 'proveedorF@example.com', true),
  ('4567890123', 'Proveedor Invernaderos G', 'Representante G', 'Calle Proveedor G #901', '4567890123', 'proveedorG@example.com', true),
  ('6543210987', 'Proveedor Invernaderos H', 'Representante H', 'Calle Proveedor H #234', '6543210987', 'proveedorH@example.com', true),
  ('7890123456', 'Proveedor Invernaderos I', 'Representante I', 'Calle Proveedor I #567', '7890123456', 'proveedorI@example.com', true),
  ('3210987654', 'Proveedor Invernaderos J', 'Representante J', 'Calle Proveedor J #890', '3210987654', 'proveedorJ@example.com', true);


INSERT INTO "pur_headers" ("date_buy", "code_buy", "img", "id_supplier", "status") VALUES
  ('2023-01-01', 'COMPRA001', 'imagen1.jpg', 1, true),
  ('2023-01-02', 'COMPRA002', 'imagen2.jpg', 2, true),
  ('2023-01-03', 'COMPRA003', 'imagen3.jpg', 3, true),
  ('2023-01-04', 'COMPRA004', 'imagen4.jpg', 4, true),
  ('2023-01-05', 'COMPRA005', 'imagen5.jpg', 5, true),
  ('2023-01-06', 'COMPRA006', 'imagen6.jpg', 6, true),
  ('2023-01-07', 'COMPRA007', 'imagen7.jpg', 7, true),
  ('2023-01-08', 'COMPRA008', 'imagen8.jpg', 8, true),
  ('2023-01-09', 'COMPRA009', 'imagen9.jpg', 9, true),
  ('2023-01-10', 'COMPRA010', 'imagen10.jpg', 10, true);


INSERT INTO "pur_details" ("id_pur_header", "id_product") VALUES
  (1, 1),
  (1, 2),
  (2, 3),
  (2, 4),
  (3, 5),
  (3, 6),
  (4, 7),
  (4, 8),
  (5, 9),
  (5, 10);

INSERT INTO "sal_group_clients" ("name") VALUES
  ('Empresas Floricolas'),
  ('Pequeñas Empresas'),
  ('Minoritarios'),
  ('Agricultores');


 INSERT INTO "sal_group_clients" ("name", "percentage") VALUES
  ('Clientes mayoristas', 15.00),
  ('Clientes minoristas', 10.00),
  ('Distribuidores regionales', 12.00),
  ('Empresas de jardinería', 8.00),
  ('Centros educativos', 5.00),
  ('Organizaciones sin fines de lucro', 5.00),
  ('Gobiernos locales', 5.00),
  ('Empresas de paisajismo', 7.00),
  ('Productores agrícolas', 10.00),
  ('Hoteles y resorts', 3.00);


INSERT INTO "sal_clients" ("ci", "name", "lastname", "address", "phone", "email", "id_group_cli", "status") VALUES
  ('1234567890', 'Cliente Mayorista 1', 'Apellido 1', 'Calle Cliente Mayorista 1 #123', '1234567890', 'clienteMayorista1@example.com', 1, true),
  ('0987654321', 'Cliente Mayorista 2', 'Apellido 2', 'Calle Cliente Mayorista 2 #456', '0987654321', 'clienteMayorista2@example.com', 1, true),
  ('1357924680', 'Cliente Minorista 1', 'Apellido 3', 'Calle Cliente Minorista 1 #789', '1357924680', 'clienteMinorista1@example.com', 2, true),
  ('2468135790', 'Cliente Minorista 2', 'Apellido 4', 'Calle Cliente Minorista 2 #012', '2468135790', 'clienteMinorista2@example.com', 2, true),
  ('9876543210', 'Distribuidor Regional 1', 'Apellido 5', 'Calle Distribuidor Regional 1 #345', '9876543210', 'distribuidorRegional1@example.com', 3, true),
  ('0123456789', 'Distribuidor Regional 2', 'Apellido 6', 'Calle Distribuidor Regional 2 #678', '0123456789', 'distribuidorRegional2@example.com', 3, true),
  ('4567890123', 'Empresa de Jardinería 1', 'Apellido 7', 'Calle Empresa de Jardinería 1 #901', '4567890123', 'empresaJardineria1@example.com', 4, true),
  ('6543210987', 'Empresa de Jardinería 2', 'Apellido 8', 'Calle Empresa de Jardinería 2 #234', '6543210987', 'empresaJardineria2@example.com', 4, true),
  ('7890123456', 'Centro Educativo 1', 'Apellido 9', 'Calle Centro Educativo 1 #567', '7890123456', 'centroEducativo1@example.com', 5, true),
  ('3210987654', 'Centro Educativo 2', 'Apellido 10', 'Calle Centro Educativo 2 #890', '3210987654', 'centroEducativo2@example.com', 5, true);


INSERT INTO "quo_headers" ("date_quo", "code_quo", "id_client", "id_iva", "created", "status") VALUES
  ('2023-01-01', 'QUOT001', 1, 1, 'Usuario 1', true),
  ('2023-01-02', 'QUOT002', 2, 2, 'Usuario 2', true),
  ('2023-01-03', 'QUOT003', 3, 3, 'Usuario 3', true),
  ('2023-01-04', 'QUOT004', 4, 4, 'Usuario 4', true),
  ('2023-01-05', 'QUOT005', 5, 5, 'Usuario 5', true),
  ('2023-01-06', 'QUOT006', 6, 6, 'Usuario 6', true),
  ('2023-01-07', 'QUOT007', 7, 7, 'Usuario 7', true),
  ('2023-01-08', 'QUOT008', 8, 8, 'Usuario 8', true),
  ('2023-01-09', 'QUOT009', 9, 9, 'Usuario 9', true),
  ('2023-01-10', 'QUOT010', 10, 10, 'Usuario 10', true);


INSERT INTO "quo_details" ("id_quo_header", "id_product") VALUES
  (1, 1),
  (1, 2),
  (2, 3),
  (2, 4),
  (3, 5),
  (3, 6),
  (4, 7),
  (4, 8),
  (5, 9),
  (5, 10);

alter table sal_clients add type boolean;
alter table sal_clients  add tradename varchar(255);







