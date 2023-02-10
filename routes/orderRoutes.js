const OrdersController = require('../controllers/ordersController');
const passport = require('passport');


module.exports = (app,upload) => {

    // GET -> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS

    app.get('/api/orders/findByOrder/:status',OrdersController.findByOrder);
 
    app.get('/api/orders/finSolicitudes/:status',OrdersController.findSolicitudesCentros);// listar ordenes
    app.post('/api/orders/create', upload.array('image', 1), passport.authenticate('jwt', { session: false }), OrdersController.create);
    app.post('/api/orders/createCentros', upload.array('image', 1), passport.authenticate('jwt', { session: false }), OrdersController.createCentros);
    app.get('/api/orders/findByClientAndStatus/:id_client/:status',  passport.authenticate('jwt', { session: false }), OrdersController.findByClientAndStatus);
    app.get('/api/orders/findByClientwallet/:id_client/:status',  OrdersController.findByClientwallet);// ver estados premios

    app.put('/api/orders/AceptarOrdenEmpresa',   OrdersController.AceptarOrdenEmpresa);//EMPRESA ACEPTA LA ORDEN 
    app.put('/api/orders/RechazarOrdenEmpresa',   OrdersController.RechazarOrdenEmpresa);// EMPRESA RECHAZA LA ORDEN
    app.get('/api/orders/findByDeliveryAndStatus/:id_delivery/:status',  passport.authenticate('jwt', { session: false }), OrdersController.findByDeliveryAndStatus);
    app.put('/api/orders/updateToDispatched',  passport.authenticate('jwt', { session: false }), OrdersController.updateToDispatched);
    app.put('/api/orders/updateToOnTheWay',  passport.authenticate('jwt', { session: false }), OrdersController.updateToOnTheWay);
    app.put('/api/orders/recolectado',  passport.authenticate('jwt', { session: false }), OrdersController.recolectado);
    app.put('/api/orders/updateToDelivered',  passport.authenticate('jwt', { session: false }), OrdersController.updateToDelivered);
    app.put('/api/orders/updateLatLng',  passport.authenticate('jwt', { session: false }), OrdersController.updateLatLng);

   
}