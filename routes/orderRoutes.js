const OrdersController = require('../controllers/ordersController');
const passport = require('passport');


module.exports = (app,upload) => {

    // GET -> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS

    app.get('/api/orders/findByOrder/:status',OrdersController.findByOrder);
    app.post('/api/orders/create', upload.array('image', 1), passport.authenticate('jwt', { session: false }), OrdersController.create);
    app.get('/api/orders/findByClientAndStatus/:id_client/:status',  passport.authenticate('jwt', { session: false }), OrdersController.findByClientAndStatus);



    app.get('/api/orders/findByDeliveryAndStatus/:id_delivery/:status',  passport.authenticate('jwt', { session: false }), OrdersController.findByDeliveryAndStatus);
    app.put('/api/orders/updateToDispatched',  passport.authenticate('jwt', { session: false }), OrdersController.updateToDispatched);
    app.put('/api/orders/updateToOnTheWay',  passport.authenticate('jwt', { session: false }), OrdersController.updateToOnTheWay);
    app.put('/api/orders/updateToDelivered',  passport.authenticate('jwt', { session: false }), OrdersController.updateToDelivered);
    app.put('/api/orders/updateLatLng',  passport.authenticate('jwt', { session: false }), OrdersController.updateLatLng);

   
}