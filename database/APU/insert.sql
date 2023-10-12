INSERT INTO sec_roles (nombre, descripcion, estado, permisos) VALUES 
('ROL_ADMIN','Admin', true, 'Todos');

INSERT INTO sec_users (nombre, apellido, email, password, img, estado, rol_id) VALUES
('Super', 'Admin', 'admin@admin.com', '$2a$10$zyrUdVaTP98dvzWM4GUrtOhvNl6I32B3.S8ICc/EPhc.6ZKGh9d4a', 'profile.jpg', TRUE,1);

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
