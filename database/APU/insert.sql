-- Tabla de roles
CREATE TABLE sec_roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    descripcion VARCHAR (50),
    estado BOOLEAN
);
CREATE TABLE sec_modulos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    estado BOOLEAN
);
CREATE TABLE sec_permisos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    estado boolean
);

CREATE TABLE roles_modulos_permisos (
    id_rol INT,
    id_modulo INT,
    id_permiso INT,
    FOREIGN KEY (id_rol) REFERENCES sec_roles(id),
    FOREIGN KEY (id_modulo) REFERENCES sec_modulos(id),
    FOREIGN KEY (id_permiso) REFERENCES sec_permisos(id)
);


INSERT INTO sec_roles (nombre, descripcion, estado, permisos) VALUES 
('ROL_ADMIN','Admin', true, 'Todos');

INSERT INTO sec_roles (nombre, descripcion, estado, permisos) VALUES 
('ROL_USER','User', true, 'Todos');

INSERT INTO sec_modulos (id, nombre, estado) 
VALUES (1, 'Usuarios', true);

INSERT INTO sec_modulos (id, nombre, estado) 
VALUES (2, 'Inventario', true);
INSERT INTO sec_permisos (id, nombre, estado) 
VALUES (1, 'Create', true);

INSERT INTO sec_permisos (id, nombre, estado) 
VALUES (2, 'Read', true);

INSERT INTO sec_permisos (id, nombre, estado) 
VALUES (3, 'Update', true);

INSERT INTO sec_permisos (id, nombre, estado) 
VALUES (4, 'Delete', true);

INSERT INTO roles_modulos_permisos (id_rol, id_modulo, id_permiso) 
VALUES (1, 1, 1);

INSERT INTO roles_modulos_permisos (id_rol, id_modulo, id_permiso) 
VALUES (1, 2, 2);

INSERT INTO roles_modulos_permisos (id_rol, id_modulo, id_permiso) 
VALUES (2, 1, 1);

INSERT INTO roles_modulos_permisos (id_rol, id_modulo, id_permiso) 
VALUES (2, 2, 1);

INSERT INTO sec_users (nombre, apellido, email, password, img, estado, rol_id) VALUES
('Super', 'Admin', 'admin@admin.com', '$2a$10$zyrUdVaTP98dvzWM4GUrtOhvNl6I32B3.S8ICc/EPhc.6ZKGh9d4a', 'profile.jpg', TRUE,1);
INSERT INTO sec_users (nombre, apellido, email, password, img, estado, rol_id) VALUES
('Usuario', 'User', 'user@user.com', '$2a$10$zyrUdVaTP98dvzWM4GUrtOhvNl6I32B3.S8ICc/EPhc.6ZKGh9d4a', 'profile.jpg', TRUE,2);

INSERT INTO public.inve_ice (descripcion, valor, estado)
VALUES('Otros materiales de Construcción',5, true);


INSERT INTO "inve_unidades" ("descripcion","estado") values
  ('Unidad',TRUE),
  ('Metros cuadrados',TRUE),
  ('Metros',TRUE),
  ('Kilogramo',TRUE),
  ('Pieza',TRUE),
  ('Rollo',TRUE),
  ('Caja',TRUE);


INSERT INTO public.inve_tipos_inventarios
(descripcion, estado)
VALUES('Materiales', True),
('Herramientas', True),
('Suministros', True);

INSERT INTO public.inve_categorias
(descripcion)
VALUES('Constrcción'),
('Riego'),
('Mantenimiento')
;
