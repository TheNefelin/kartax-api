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

> Se debe agregar en la raiz un archivo .env,en donde se definiran las variables de entornos la conexion a la base de datos, la llave de encryptacion de contraseña y el puerto de la app
```
DB_USER="pgSql_usuario"
DB_HOST="pgSql_host"
DB_DATABASE="pgSql_database"
DB_PASSWORD="pgSql_password"
DB_PORT=5748

JWT_KEY="jwt_key"

PORT=3001
```

## Rúbrica
* Consulta a la Base de Datos
```
1. Selecciona las columnas requeridas para presentar la información solicitada.
    - (Kartax Api)  /utils/PGSQL.js "todas las funciones"

2. Utiliza JOIN para relacionar la información de distintas tablas.
    - (Kartax Api) /utils/PGSQL.js "linea 73, 121, etc.."

3. Utiliza WHERE para filtrar la información requerida.
    - (Kartax Api) /utils/PGSQL.js "linea 16, 29, 154, etc.."

4. Utiliza cláusulas de ordenamiento para presentar la información.
    - (Kartax Api) /utils/PGSQL.js "linea 126, etc.."

5. Utiliza cláusulas de agrupación de información para obtener datos agregados
    - (Kartax Api) /utils/PGSQL.js "linea 65, etc.."
```
* Algoritmo de cálculo y manipulación de archivos de texto
```
6. Utilización general del lenguaje, sintaxis, selección de tipos de datos, sentencias lógicas, expresiones, operaciones, comparaciones.
    - (Kartax Express y Kartax Api) /utils/funciones.js

7. Utilización de sentencias repetitivas.
    - (Kartax Express) 
    /utils/funciones.js ".map" "linea 157"
    /views/partials/appAcordion.hbs ".forEach" "linea 28, 31, etc..."
    
8. Convenciones y estilos de programación.
    - (Kartax Express y Kartax Api) "codigo comentado, calses en mayusculas, etc.."

9. Utilización correcta de estructuras de datos
    - (Kartax Api) 
    /sql/PostgreSQL_query.sql "instrucciones para construir la BD"
    /sql/PostgreSQL_diag.pgerd "Modelo relacional de la BD"

10. Manipulación de archivos.
    - (Kartax Express) /utils/funciones.js
    guardarToken() y validarToken()
```
* Página web y html
```
11. Utilización de tags html, estilos y responsividad.
    - (Kartax Express) 
    /views/partials/appKartax.hbs "tags html"
    /public/css/index.css "estilos y responsividad de la app"

12. Utilización de Bootstrap.
    - (Kartax Express) 
    /views/encuesta.hbs "CDN links"
```
* Lenguaje Node
```
13. Inclusión de paquetes y librerías de usuario.
    - (Kartax Express y Kartax Api) /package.json "linea 2"

14. Agrupación del código y separación por funcionalidad.
    - (Kartax Express y Kartax Api) en la raiz de ambos proyectos

15. Utilización de funciones asíncronas.
    - (Kartax Express)  /utils/funciones.js y ApiPostgreSQL.js
    - (Kartax Api)      /utils/funciones.js y PGSQL.js

16. Lectura de parámetros de entrada.
    - (Kartax Express y Kartax Api) /utils/funciones.js "en ambas app"

17. Funcionamiento general del aplicativo
    (Kartax Express y Kartax Api) en desarrollo continuo
```
* Conexión a Base de Datos
```
18. Manejo de conexión a base de datos desde Node
    - (Kartax Api) /utils/SecretData.js

19. Manejo y ejecución de consultas desde Node
    - (Kartax Api) /utils/PGSQL.js

20. Uso de Express
    - (Kartax Express y Kartax Api) /app.js y /server.js
```
