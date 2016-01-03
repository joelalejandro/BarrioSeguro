-- Script de inicialización de esquema BARRIOSEGURO.
create database barrioseguro;
create user barrioseguro@localhost identified by 'b4rr10s3gur0';
grant all privileges on barrioseguro.* to barrioseguro@localhost;

use barrioseguro;

create table t_tipos_incidente (
  id_tipo_incidente char(2) not null primary key,
  n_tipo_incidente char(50) not null
)
engine=innodb
charset=utf8;

create table t_incidentes (
  id_incidente int(11) not null primary key auto_increment,
  id_tipo_incidente char(2) not null,
  fecha_reportado datetime not null,
  fecha_incidente datetime not null,
  edad int(3) null,
  sexo enum('M', 'F', 'O') not null,
  descripcion_hechos text not null,
  direccion char(255) not null,
  latitud decimal not null,
  longitud decimal not null
)
engine=innodb
charset=utf8
auto_increment=1;

alter table t_incidentes
add constraint fk_inc_tipinc foreign key (id_tipo_incidente)
references t_tipos_incidente (id_tipo_incidente);

create index idx_inc_tipinc on t_incidentes (id_tipo_incidente);
create index idx_inc_fecrep on t_incidentes (fecha_reportado);
create index idx_inc_fecinc on t_incidentes (fecha_incidente);
create index idx_inc_edse on t_incidentes (edad, sexo);

insert into t_tipos_incidente (id_tipo_incidente, n_tipo_incidente)
values ('RO', 'Robo'), ('SE', 'Secuestro'), ('AF', 'Agresión física'),
('HO', 'Homicidio'), ('VA', 'Vandalismo'), ('VI', 'Violación');

create view vt_incidentes as
select i.*, ti.n_tipo_incidente
  from t_incidentes i,
	   t_tipos_incidente ti
 where i.id_tipo_incidente = ti.id_tipo_incidente;