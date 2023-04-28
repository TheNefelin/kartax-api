-- ---------------------------------------------------------------------
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.caja
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    monto integer NOT NULL,
    fecha_ini date NOT NULL,
    fecha_fin date NOT NULL,
    is_active boolean NOT NULL,
    id_usuario integer NOT NULL,
    CONSTRAINT caja_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.color
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    nombre character varying(50) COLLATE pg_catalog."default" NOT NULL,
    r integer NOT NULL,
    g integer NOT NULL,
    b integer NOT NULL,
    id_negocio integer NOT NULL,
    CONSTRAINT color_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.comanda
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    fecha date NOT NULL,
    is_active boolean NOT NULL,
    id_mesa integer NOT NULL,
    CONSTRAINT comanda_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.comanda_deta
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    fecha date NOT NULL,
    id_item integer NOT NULL,
    id_comanda integer NOT NULL,
    CONSTRAINT comanda_deta_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.item
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    nombre character varying(50) COLLATE pg_catalog."default" NOT NULL,
    descripcion character varying(255) COLLATE pg_catalog."default" NOT NULL,
    precio integer NOT NULL,
    img character varying(255) COLLATE pg_catalog."default" NOT NULL,
    is_active boolean NOT NULL,
    id_item_categ integer NOT NULL,
    CONSTRAINT item_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.item_categ
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    nombre character varying(50) COLLATE pg_catalog."default" NOT NULL,
    id_tipo_alimento integer NOT NULL,
    CONSTRAINT item_categ_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.mesa
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    nombre character varying(50) COLLATE pg_catalog."default" NOT NULL,
    descripcion character varying(50) COLLATE pg_catalog."default" NOT NULL,
    is_active boolean NOT NULL,
    id_negocio integer NOT NULL,
    CONSTRAINT mesa_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.negocio
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    nombre character varying(50) COLLATE pg_catalog."default" NOT NULL,
    rut character(12) COLLATE pg_catalog."default" NOT NULL,
    direccion character varying(255) COLLATE pg_catalog."default" NOT NULL,
    descripcion character varying(255) COLLATE pg_catalog."default",
    logo character varying(255) COLLATE pg_catalog."default",
    is_active boolean NOT NULL,
    CONSTRAINT negocio_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.rol
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    nombre character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT rol_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.rrss
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    nombre character varying(50) COLLATE pg_catalog."default" NOT NULL,
    img character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT rrss_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.rrss_negocio
(
    id_rrss integer NOT NULL,
    id_negocio integer NOT NULL,
    link character(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT rrss_negocio_pkey PRIMARY KEY (id_rrss, id_negocio)
);

CREATE TABLE IF NOT EXISTS public.salida
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    fecha date NOT NULL,
    id_caja integer NOT NULL,
    CONSTRAINT salida_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.salida_deta
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    id_item integer NOT NULL,
    nom_item character varying(50) COLLATE pg_catalog."default" NOT NULL,
    precio_item integer NOT NULL,
    cant integer NOT NULL,
    id_salida integer NOT NULL,
    CONSTRAINT salida_deta_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.tipo_alimento
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    nombre character varying(50) COLLATE pg_catalog."default" NOT NULL,
    img character varying(255) COLLATE pg_catalog."default" NOT NULL,
    is_active boolean NOT NULL,
    id_negocio integer NOT NULL,
    CONSTRAINT tipo_alimento_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.usuario
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    nombres character varying(100) COLLATE pg_catalog."default" NOT NULL,
    apellidos character varying(100) COLLATE pg_catalog."default" NOT NULL,
    correo character varying(100) COLLATE pg_catalog."default",
    usuario character varying(100) COLLATE pg_catalog."default" NOT NULL,
    clave character varying(255) COLLATE pg_catalog."default" NOT NULL,
    is_active boolean NOT NULL,
    id_rol integer NOT NULL,
    CONSTRAINT usuario_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.usuario_negocio
(
    id_usuario integer NOT NULL,
    id_negocio integer NOT NULL,
    fecha timestamp without time zone NOT NULL,
    CONSTRAINT usuario_negocio_pkey PRIMARY KEY (id_usuario, id_negocio)
);

ALTER TABLE IF EXISTS public.caja
    ADD CONSTRAINT caja_id_usuario_fkey FOREIGN KEY (id_usuario)
    REFERENCES public.usuario (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.color
    ADD CONSTRAINT color_id_negocio_fkey FOREIGN KEY (id_negocio)
    REFERENCES public.negocio (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.comanda
    ADD CONSTRAINT comanda_id_mesa_fkey FOREIGN KEY (id_mesa)
    REFERENCES public.mesa (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.comanda_deta
    ADD CONSTRAINT comanda_deta_id_comanda_fkey FOREIGN KEY (id_comanda)
    REFERENCES public.comanda (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.item
    ADD CONSTRAINT item_id_item_categ_fkey FOREIGN KEY (id_item_categ)
    REFERENCES public.item_categ (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.item_categ
    ADD CONSTRAINT item_categ_id_tipo_alimento_fkey FOREIGN KEY (id_tipo_alimento)
    REFERENCES public.tipo_alimento (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.mesa
    ADD CONSTRAINT mesa_id_negocio_fkey FOREIGN KEY (id_negocio)
    REFERENCES public.negocio (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.rrss_negocio
    ADD CONSTRAINT rrss_negocio_id_negocio_fkey FOREIGN KEY (id_negocio)
    REFERENCES public.negocio (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.rrss_negocio
    ADD CONSTRAINT rrss_negocio_id_rrss_fkey FOREIGN KEY (id_rrss)
    REFERENCES public.rrss (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.salida
    ADD CONSTRAINT salida_id_caja_fkey FOREIGN KEY (id_caja)
    REFERENCES public.caja (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.salida_deta
    ADD CONSTRAINT salida_deta_id_salida_fkey FOREIGN KEY (id_salida)
    REFERENCES public.salida (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.tipo_alimento
    ADD CONSTRAINT tipo_alimento_id_negocio_fkey FOREIGN KEY (id_negocio)
    REFERENCES public.negocio (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.usuario
    ADD CONSTRAINT usuario_id_rol_fkey FOREIGN KEY (id_rol)
    REFERENCES public.rol (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.usuario_negocio
    ADD CONSTRAINT usuario_negocio_id_negocio_fkey FOREIGN KEY (id_negocio)
    REFERENCES public.negocio (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.usuario_negocio
    ADD CONSTRAINT usuario_negocio_id_usuario_fkey FOREIGN KEY (id_usuario)
    REFERENCES public.usuario (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

-- ---------------------------------------------------------------------
-- ---------------------------------------------------------------------
CREATE EXTENSION pgcrypto;

-- SELECT crypt('123456', gen_salt('bf'));
-- SELECT * FROM usuario 
-- WHERE 
-- 	usuario = 'NEFELIN' AND
-- 	clave = crypt('123456', clave);


-- INSERT INTO rol
-- 	(nombre)
-- VALUES
-- 	('System Admin'),
-- 	('Admin'),
-- 	('Usuario');

-- INSERT INTO usuario 
-- 	(nombres, apellidos, correo, usuario, clave, is_active, id_rol) 
-- VALUES 
-- 	('FRANCISCO', 'CARMONA', 'flcarmonac@yahoo.com', 'NEFELIN', crypt('123456', gen_salt('bf')), TRUE, 1) RETURNING id;

-- INSERT INTO negocio
-- 	(nombre, rut, direccion, descripcion, logo, is_active)
-- VALUES
-- 	('Kartax', '00.000.000-0', 'Viña del Mar', 'Demo', '/img/logo.ico', TRUE);

-- INSERT INTO usuario_negocio 
-- 	(id_usuario, id_negocio, fecha)
-- VALUES
-- 	(1, 1, NOW());

-- INSERT INTO color (nombre, r, g, b, id_negocio) 
-- VALUES 
-- 	('colorBase01', 0, 0, 0, 1),
-- 	('colorBase02', 255, 255, 255, 1),
-- 	('colorBase03', 102, 102, 102, 1),
-- 	('color01', 32, 148, 243, 1),
-- 	('color02', 190, 0, 29, 1),
-- 	('color03', 252, 161, 32, 1),
-- 	('color04', 0, 255, 255, 1);

-- INSERT INTO tipo_alimento (nombre, img, is_active, id_negocio)
-- VALUES 
-- 	('Para Beber', '/img/grupo_01.jpg', TRUE, 1),
-- 	('Tablas', '/img/grupo_03.jpg', TRUE, 1),
-- 	('Para chanchear', '/img/grupo_02.jpg', TRUE, 1);

-- INSERT INTO item_categ (nombre, id_tipo_alimento) 
-- VALUES 
-- 	('Cervezas Artesanales', 1),
-- 	('Cervezas Envasadas', 1),
-- 	('De la Casa', 2),
-- 	('Hamburguesas', 3),
-- 	('Completos', 3);

-- INSERT INTO item (nombre, descripcion, precio, img, is_active, id_item_categ) 
-- VALUES 
-- 	('Pils', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 5500, './img/item_01.png', TRUE, 1),
-- 	('Santa Sed', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 4800, './img/item_02.png', TRUE, 1),
-- 	('Blood', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 4500, './img/item_03.png', TRUE, 1),
-- 	('Heineken', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 2500, './img/item_04.jpg', TRUE, 2),
-- 	('Kross', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 3500, './img/item_05.jpg', TRUE, 2),
-- 	('Kunstmann', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 2500, './img/item_06.jpg', TRUE, 2),
-- 	('Budweiser', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 2000, './img/item_07.jpg', TRUE, 2),
-- 	('Royal', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 2500, './img/item_08.jpg', TRUE, 2),
-- 	('Tabla de Carne', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 7000, './img/item_09.png', TRUE, 3),
-- 	('Tabla de Queso', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 7000, './img/item_10.png', TRUE, 3),
-- 	('Tabla Veggie', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 7000, './img/item_11.png', TRUE, 3),
-- 	('Papas Rústicas', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 5000, './img/item_12.png', TRUE, 3),
-- 	('Papas Merken', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 5000, './img/item_13.png', TRUE, 3),
-- 	('Papas Cheddar', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 6000, './img/item_14.png', TRUE, 3),
-- 	('Hamburguesa de Res', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 6000, './img/item_15.png', TRUE, 4),
-- 	('Hamburguesa Pollo Apanado', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 6000, './img/item_16.png', TRUE, 4),
-- 	('Hamburguesa Doble Cheddar', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 6000, './img/item_17.png', TRUE, 4),
-- 	('Hamburguesa Mechada', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 6000, './img/item_18.png', TRUE, 4),
-- 	('Hamburguesa Veggie', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 6000, './img/item_19.png', TRUE, 4),
-- 	('Hamburguesa Veggie Legumbres', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 6000, './img/item_20.png', TRUE, 4),
-- 	('Completo Mexicano', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 3000, './img/item_21.png', TRUE, 5),
-- 	('Completo Tocino', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 3000, './img/item_22.png', TRUE, 5),
-- 	('Completo Italiano', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 3000, './img/item_23.png', TRUE, 5),
-- 	('Completo Aleman', 'nace de lupulo y cebada, y vive en una botella encerrada, puede ser morena o dorada, puede ser de trigo o cereza, para ser sincero sin rodeo digo, buena amiga es la cerveza"', 3000, './img/item_24.png', TRUE, 5);

-- INSERT INTO rrss
-- 	(nombre, img)
-- VALUES
-- 	('Facebook', '/img/RRSS/facebook2.svg'),
-- 	('Instagram', '/img/RRSS/instagram1.svg'),
-- 	('twitter', '/img/RRSS/twitter2.svg'),
-- 	('Whatsapp', '/img/RRSS/whatsapp1.svg');

-- INSERT INTO mesa
-- 	(nombre, descripcion, is_active, id_negocio)
-- VALUES
-- 	('Barra', 'Interna', TRUE, 1);

-- ---------------------------------------------------------------------
-- ---------------------------------------------------------------------
SELECT * FROM rol;
SELECT * FROM usuario;
SELECT * FROM negocio;
SELECT * FROM usuario_negocio;
SELECT * FROM color;
SELECT * FROM tipo_alimento;
SELECT * FROM item_categ;
SELECT * FROM item;
SELECT * FROM rrss;
SELECT * FROM mesa;
SELECT * FROM comanda;
SELECT * FROM comanda_deta;
------
SELECT * FROM caja;
SELECT * FROM rrss_negocio;
SELECT * FROM salida;
SELECT * FROM salida_deta;

-- ---------------------------------------------------------------------
-- DROP TABLE public.rol CASCADE; 
-- DROP TABLE public.usuario CASCADE; 
-- DROP TABLE public.negocio CASCADE; 
-- DROP TABLE public.usuario_negocio CASCADE; 
-- DROP TABLE public.color CASCADE; 
-- DROP TABLE public.tipo_alimento CASCADE; 
-- DROP TABLE public.item_categ CASCADE; 
-- DROP TABLE public.item CASCADE; 
-- DROP TABLE public.rrss CASCADE;
-- DROP TABLE public.mesa CASCADE; 
-- DROP TABLE public.comanda CASCADE; 
-- DROP TABLE public.comanda_deta CASCADE; 
-- DROP TABLE public.caja CASCADE; 
-- DROP TABLE public.rrss_negocio CASCADE;
-- DROP TABLE public.salida CASCADE; 
-- DROP TABLE public.salida_deta CASCADE; 

-- ---------------------------------------------------------------------
SELECT
	a.nombre AS negocio,
	a.rut,
	a.direccion,
	a.descripcion,
	a.logo,
	a.is_active
FROM negocio a 
	INNER JOIN usuario_negocio b ON b.id_negocio = a.id
	INNER JOIN usuario c ON c.id = b.id_usuario;

SELECT 
    id, 
    nombre, 
    logo
FROM negocio
WHERE 
    is_active = TRUE 
    AND id = 1;

SELECT 
	b.id,
	b.nombre,
	b.logo,
	a.id AS id_mesa 
FROM mesa a 
	INNER JOIN negocio b ON b.id = a.id_negocio
WHERE
	a.id = 1
	AND a.is_active = TRUE
	AND b.is_active = TRUE;
    
SELECT 
    id, 
    nombre, 
    img
FROM tipo_alimento
WHERE 
    is_active = TRUE 
    AND id_negocio = 1;

SELECT 
    id,
    nombre,
    id_tipo_alimento
FROM item_categ
WHERE 
    id_tipo_alimento = 1;

SELECT 
    id,
    nombre,
    descripcion,
    precio,
    img
FROM item
WHERE 
    is_active = TRUE
    AND id_item_categ = 1;

SELECT
	a.id,
	a.usuario,
	a.nombres,
	a.apellidos,
	a.correo,
	b.nombre AS rol
FROM usuario a 
	INNER JOIN rol b ON a.id_rol = b.id
WHERE
	a.is_active = TRUE
	AND a.usuario = 'NEFELIN';

SELECT 
	a.nombre,
	a.rut,
	a.direccion,
	a.descripcion,
	a.logo,
	a.is_active,
	b.fecha
FROM negocio a 
	INNER JOIN usuario_negocio b ON a.id = b.id_negocio
WHERE 
	b.id_usuario = 1;
    
-- ---------------------------------------------------------------------
-- ---------------------------------------------------------------------