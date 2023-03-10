const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const passport =require('passport');
const multer = require('multer');

/*
* IMPORTAR RUTAS
*/
const usersRoutes = require('./routes/userRoutes');
const ordersRoutes = require('./routes/orderRoutes');
const addressRoutes = require('./routes/addressRoutes');
const premiosRoutes = require('./routes/premiosRoutes');
const productRoutes = require('./routes/productRoutes');
const categoriesRoutes = require('./routes/categoryRoutes');

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
require ('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port', port);
const upload = multer({
    storage: multer.memoryStorage()
});

/*
* LLAMADO DE LAS RUTAS
*/
usersRoutes(app, upload);
ordersRoutes(app,upload);
addressRoutes(app);
premiosRoutes(app);
categoriesRoutes(app);
productRoutes(app, upload);

// server.listen(3000, 'localhost', function() {
//     console.log('Aplicacion de NodeJS ' + port + ' Iniciada...')
// });


// ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

app.get('/',  (req, res) => {
    res.send('Ruta raiz del backend');
});

app.listen(3000, ()=>{
    console.log('Aplicacion de NodeJS')
})

module.exports = {
    app: app,
    server: server
}

// 200 - ES UN RESPUESTA EXITOSA
// 404 - SIGNIFICA QUE LA URL NO EXISTE
// 500 - ERROR INTERNO DEL SERVIDOR