# Kartax Api

> Proyectos Relacionados
* https://github.com/TheNefelin/kartax-api.git
* https://github.com/TheNefelin/kartax-express.git

> Las app estan corriendo en los siguiente links
* https://kartax-api-production.up.railway.app
* https://kartax-express-production.up.railway.app

> Dependencias
```
npm install cors
npm install dotenv
npm install express
npm install express-fileupload
npm install jsonwebtoken
npm install pg
```

> Para construir la Base de Datos se debe ejecutar el archivo PostgreSQL_query.sql en PostreSQL

> Para las conexiones a la BD se debe crear y configurar un archivo .env en la raiz
```
DB_USER="pgSql_usuario"
DB_HOST="pgSql_host"
DB_DATABASE="pgSql_database"
DB_PASSWORD="pgSql_password"
DB_PORT=5748
```

> Para encriptar el token se debe guardar la key en el archivo .env
```
JWT_KEY="jwt_key"
```

## Rúbrica
* Consulta a la Base de Datos
```
1. Selecciona las columnas requeridas para presentar la información solicitada.
    - (Kartax Api) archivo /utils/PGSQL.js "todas las funciones"
2. Utiliza JOIN para relacionar la información de distintas tablas.
    - (Kartax Api) archivo /utils/PGSQL.js "linea 43, 138, etc.."
3. Utiliza WHERE para filtrar la información requerida.
    - (Kartax Api) archivo /utils/PGSQL.js "linea 16, 29, etc.."
4. Utiliza cláusulas de ordenamiento para presentar la información.
    - (Kartax Api) archivo /utils/PGSQL.js "linea 144, etc.."
5. Utiliza cláusulas de agrupación de información para obtener datos agregados
    - () -- SIN REVISAR AUN -----------------------------------
```
* Algoritmo de cálculo y manipulación de archivos de texto
```
6. Utilización general del lenguaje, sintaxis, selección de tipos de datos, sentencias lógicas, expresiones, operaciones, comparaciones.
    - (Kartax Express) /utils/funciones.js
7. Utilización de sentencias repetitivas.
    - () -- SIN REVISAR AUN -----------------------------------
8. Convenciones y estilos de programación.
    - () -- SIN REVISAR AUN -----------------------------------
9. Utilización correcta de estructuras de datos
    - () -- SIN REVISAR AUN -----------------------------------
10. Manipulación de archivos.
    - () -- SIN REVISAR AUN -----------------------------------
```
* Página web y html
```
11. Utilización de tags html, estilos y responsividad.
    - () -- SIN REVISAR AUN -----------------------------------
12. Utilización de Bootstrap.
    - () -- SIN REVISAR AUN -----------------------------------
```
* Lenguaje Node
```
13. Inclusión de paquetes y librerías de usuario.
    - (Kartax Express y Kartax Api) /package.json "linea 2"
14. Agrupación del código y separación por funcionalidad.
    - () -- SIN REVISAR AUN -----------------------------------
15. Utilización de funciones asíncronas.
    - (Kartax Express) /utils/funciones.js y ApiPostgreSQL.js, (Kartax Api) /utils/PGSQL.js, etc...
16. Lectura de parámetros de entrada.
    - () -- SIN REVISAR AUN -----------------------------------
17. Funcionamiento general del aplicativo
    - () -- SIN REVISAR AUN -----------------------------------
```
* Conexión a Base de Datos
```
18. Manejo de conexión a base de datos desde Node
    - (Kartax Api) /utils/SecretData.js
19. Manejo y ejecución de consultas desde Node
    - (Kartax Api) /utils/PGSQL.js
20. Uso de Express
    - (Kartax Express y Kartax Api) /index.js y /server.js
```
