# Kartax Api

> Proyectos Relacionados
* https://github.com/TheNefelin/kartax-api.git
* https://github.com/TheNefelin/kartax-express.git

> Dependencias
```
npm install express
npm install pg
npm install jsonwebtoken
npm install express-fileupload
npm install cors
npm install dotenv
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

