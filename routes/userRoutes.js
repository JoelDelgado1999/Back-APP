const usersController = require('../controllers/usersController');
const passport = require('passport');
module.exports = (app,upload) => {

    // GET -> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS

    app.post('/api/users/create', usersController.register);
    app.post('/api/users/createCentros', usersController.registroCentros);// crear cuentas  de centros de acopio -WEB 
    app.get('/api/users/ListarCentros', usersController.findCentros);// listar Centros de acopio -WEB
    app.delete('/api/user/delete/:id_user',usersController.delete);// eliminar CENTROS  -WEB
    app.post('/api/users/login', usersController.login);// login
    app.post('/api/users/createWithImage', upload.array('image', 1), usersController.registerWithImage);

    app.put('/api/users/update', passport.authenticate('jwt', { session: false }), upload.array('image', 1), usersController.updateWithImage);
    app.put('/api/users/updateWithoutImage', passport.authenticate('jwt', { session: false }), usersController.updateWithoutImage);
    app.put('/api/users/updatecentroacopio/:id',  usersController.updateCentroAcopio);
    //app.post('/api/users/asignar', usersController.asignarpuntos);
     //app.put('/api/users/asignarHistory', usersController.asignarpuntosHistory);
    app.post('/api/users/asignarHistory2', usersController.asignarpuntosHistory2);
  

    app.post('/api/login/dashboard', usersController.loginAdminDashboard);




   
}