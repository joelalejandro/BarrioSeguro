var restify = require('restify');
var mysql = require('mysql');
var moment = require('moment');

var models = {};
models.incidente = function(r) {
  return {
    id: r.id_incidente,
    tipoIncidente: models.tipoIncidente(r),
    fechaReportado: r.fecha_reportado,
    fechaIncidente: r.fecha_incidente,
    edad: r.edad,
    sexo: r.sexo,
    descripcionHechos: r.descripcion_hechos,
    direccion: r.direccion,
    latitud: r.latitud,
    longitud: r.longitud
  }
};
models.tipoIncidente = function(r) {
  return {
    id: r.id_tipo_incidente,
    nombre: r.n_tipo_incidente
  }
};

var server = restify.createServer({
  name: 'BarrioSeguro Web API'
});
var db = mysql.createConnection({
  host: 'localhost',
  user: 'barrioseguro',
  password: 'b4rr10s3gur0',
  database: 'barrioseguro'
});

server.use(function(req, res, next) {
  res.charSet('utf-8');
  return next();
});
server.use(restify.queryParser({ mapParams: false }));

server.get('/incidentes', function(req, res, next) {
  var sql = 'SELECT * FROM vt_incidentes WHERE 1=1';
  if (req.query) {
    if (req.query.tipoIncidente) {
      sql += ' AND id_tipo_incidente = "' + db.escape(req.query.tipoIncidente) + '"';
    }
    if (req.query.edadDesde) {
      sql += ' AND edad >= ' + db.escape(req.query.edadDesde);
    }
    if (req.query.edadHasta) {
      sql += ' AND edad <= ' + db.escape(req.query.edadHasta);
    }
    if (req.query.sexo) {
      sql += ' AND sexo = ' + db.escape(req.query.sexo);
    }
    if (req.query.fechaIncidenteDesde) {
      sql += ' AND fecha_incidente >= STR_TO_DATE(' + db.escape(req.query.fechaIncidenteDesde) + ', "%d/%m/%Y")'
    }
    if (req.query.fechaIncidenteHasta) {
      sql += ' AND fecha_incidente <= STR_TO_DATE(' + db.escape(req.query.fechaIncidenteHasta) + ', "%d/%m/%Y")'
    }
    if (req.query.fechaReportadoDesde) {
      sql += ' AND fecha_incidente >= STR_TO_DATE(' + db.escape(req.query.fechaReportadoDesde) + ', "%d/%m/%Y")'
    }
    if (req.query.fechaReportadoHasta) {
      sql += ' AND fecha_incidente <= STR_TO_DATE(' + db.escape(req.query.fechaReportadoHasta) + ', "%d/%m/%Y")'
    }
  }
  db.query(sql, function(err, rows, fields) {
    res.send({ incidentes: rows.map(models.incidente) });
  });
  return next();
});

server.get('/incidente/:id', function(req, res, next) {
  db.query('SELECT * FROM vt_incidentes WHERE id_incidente = ' + db.escape(req.params.id), function(err, rows, fields) {
    if (rows.length) {
      res.send({ incidente: models.incidente(rows[0]) });
    } else {
      res.send({ incidente: null });
    }
  });
  return next();
});

server.get('/tiposIncidente', function(req, res, next) {
  db.query('SELECT * FROM t_tipos_incidente', function(err, rows, fields) {
    res.send({ tiposIncidente: rows.map(models.tipoIncidente) });
  });
  return next();
});

server.post('/incidentes', function(req, res, next) {
  db.query('INSERT INTO t_incidentes SET ?', {
    fecha_reportado: moment().format(),
    fecha_incidente: req.params.fechaIncidente,
    id_tipo_incidente: req.params.idTipoIncidente,
    edad: req.params.edad,
    sexo: req.params.sexo,
    descripcion_hechos: req.params.descripcionHechos,
    direccion: req.params.direccion,
    latitud: req.params.latitud,
    longitud: req.params.longitud
  }, function(err, result) {
    res.send({ incidente: { id: result.insertId }});
  });
  return next();
});

server.listen(8080);