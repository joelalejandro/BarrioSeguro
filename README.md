# BarrioSeguro
Un sistema sencillo para reportar hechos criminales, visualizados en un mapa de incidentes.

## Dependencias

### Mapa:
- Leaflet (>= 0.7.7)
- MapQuest API SDK: Maps, Geocoding (v2)
- Moment.js (>= 2.10.6)
### Web API:
```js
  "dependencies": {
    "moment": "^2.11.0",
    "mysql": "^2.10.0",
    "restify": "^4.0.3"
  }
```

## Instrucciones de despliegue
1. Ejecutar el script `db/schema.sql` con un usuario con privilegios SUPER en MySQL.
2. Levantar un Web Server sobre la carpeta `www/`.