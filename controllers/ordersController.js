const Order = require('../models/order');
const User = require('../models/user');
const storage = require('../utils/cloud_storage');

module.exports = {

    async create(req, res) {
        const order = JSON.parse(req.body.order);
        
        const files = req.files;
              
       if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                order.evidencia = url;
            }
        }

        Order.create(order, async (err, id) => {
  
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de crear la orden',
                    error: err
                });
            }

                return res.status(201).json({
                success: true,
                message: 'La orden se ha creado correctamente',
                data: `${id}` // EL ID DE LA NUEVA CATEGORIA
            });

        });
    
    },
    async createCentros(req, res) {
        const order = JSON.parse(req.body.order);
        
        const files = req.files;
              
       if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                order.evidencia = url;
            }
        }

        Order.createCentros(order, async (err, id) => {
  
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de crear la orden',
                    error: err
                });
            }

                return res.status(201).json({
                success: true,
                message: 'La orden se ha creado correctamente',
                data: `${id}` // EL ID DE LA NUEVA CATEGORIA
            });

        });
    
    },




    AceptarOrdenEmpresa(req, res) {
        const order = req.body;


        Order.AceptarOrdenEmpresa(order.id,order.id_empresa, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de aceptar la orden',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se acepto correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    },
    
    RechazarOrdenEmpresa(req, res) {
        const order = req.body;


        Order.RechazarOrdenEmpresa(order.id,order.id_empresa, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de rechazar la orden',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se rechazo correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    },
    



   
    findByOrder(req, res)//recibo todas las solicitudes de todos los usuarios
     {
        const status = req.params.status;
        Order.findByOrder(status, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al tratar de obtener las ordenes',
                    error: err
                });
            }
            for (const d of data) {
                d.address = JSON.parse(d.address);
                d.client = JSON.parse(d.client);
                d.delivery = JSON.parse(d.delivery);
           
            }
            return res.status(201).json(data);
        })
    },
    findSolicitudesCentros(req, res)//recibo todas las solicitudes de todos los Centros de acopio
    {
       const status = req.params.status;
       Order.findSolicitudesCentros(status, (err, data) => {
           if (err) {
               return res.status(501).json({
                   success: false,
                   message: 'Hubo un error al tratar de obtener las ordenes',
                   error: err
               });
           }
           for (const d of data) {
               d.client = JSON.parse(d.client);
               d.empresa = JSON.parse(d.empresa);
          
           }
           return res.status(201).json(data);
       })
   },


    findByDeliveryAndStatus(req, res) {
        const id_delivery = req.params.id_delivery;
        const status = req.params.status;

        Order.findByDeliveryAndStatus(id_delivery, status, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las ordenes',
                    error: err
                });
            }

            for (const d of data) {
                d.address = JSON.parse(d.address);
                d.client = JSON.parse(d.client);
                d.delivery = JSON.parse(d.delivery);
               
            }
            
            
            return res.status(201).json(data);
        });
    },
    
    findByCentrosSolicitudesAndStatus(req, res) {
        const id_client = req.params.id_client;
        const status = req.params.status;

        Order.findByCentrosSolicitudesAndStatus(id_client, status, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las ordenes',
                    error: err
                });
            }

            for (const d of data) {
                
                d.client = JSON.parse(d.client);
               
            }
            
            
            return res.status(201).json(data);
        });
    },

    findByClientAndStatus(req, res) {
        const id_client = req.params.id_client;
        const status = req.params.status;

        Order.findByClientAndStatus(id_client, status, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las ordenes',
                    error: err
                });
            }

            for (const d of data) {
                d.address = JSON.parse(d.address);
                d.client = JSON.parse(d.client);
                d.delivery = JSON.parse(d.delivery);
            }
            
            
            return res.status(201).json(data);
        });
    },

    GetWalletByClientId(req, res) {
        console.log('erorro')
       // const a = req.body;
        const id_user = req.params.id_user;
        console.log('cliente',id_user);
       

        Order.GetWalletByClientId(id_user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las ordenes',
                    error: err
                });
            }
            
           const  HistorialBilletera =  data ;
            console.log('errroor',HistorialBilletera);
           let acumulador =0;
           for(const a of HistorialBilletera ){

             acumulador = a.puntos + acumulador;

             console.log('errroor puntos',a.puntos);
            

           }

            const response = { historialWallet: data, totalPuntosBilletera : acumulador  }
            
            
            Order.update_user_wallet( acumulador,id_user,  async (err, id) => {

                console.log('data',id_user,acumulador);
                  console.log('subido');
     
                     
     
             }); 
             Order.update_user_puntos( acumulador,id_user,  async (err, id) => {

                console.log('data',id_user,acumulador);
                  console.log('subido usuarios puntos');
     
                     
     
             }); 
             Order.update_puntos_ordenes( acumulador,id_order,  async (err, id) => {

                console.log('data',id_user,acumulador);
                  console.log('subido ordenes puntos');
     
                     
     
             }); 


            return res.status(201).json(response);


        });
    // funcion global
        

    },

    






    updateToDispatched(req, res) {
        const order = req.body;

        Order.updateToDispatched(order.id, order.id_delivery, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de actualizar la orden',
                    error: err
                });
            }

            User.findById(order.id_delivery, (err, user) => {
                
                if (user !== undefined && user !== null) {

                    console.log('NOTIFICATION TOKEN', user.notification_token);
                    PushNotificationsController.sendNotification(user.notification_token, {
                        title: 'PEDIDO ASIGNADO',
                        body: 'Te han asignado un pedido para entregar',
                        id_notification: '1'
                    });
                }

            });
            
            return res.status(201).json({
                success: true,
                message: 'La orden se ha actualizado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    },
    recolectado(req, res) {
        const order = req.body;

        Order.recolectado(order.id, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de actualizar la orden',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se ha actualizado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    },
    updateToOnTheWay(req, res) {
        const order = req.body;


        Order.updateToOnTheWay(order.id,order.id_delivery, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de actualizar la orden',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se ha actualizado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    },
    


    updateToOnInnomine(req, res) {
        const order = req.body;


        Order.updateToOnInomine(order.id,order.id_delivery, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de aceptar la orden',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se ha actualizado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    },

    updateToOfInnomine(req, res) {
        const order = req.body;


        Order.updateToOfInomine(order.id,order.id_delivery, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de rechazar la solicitud',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se ha rechazado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    },




    updateToDelivered(req, res) {
        const order = req.body;

        Order.updateToDelivered(order.id, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de actualizar la orden',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se ha actualizado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    },
   
    updateLatLng(req, res) {
        const order = req.body;

        Order.updateLatLng(order, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de actualizar la orden',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se ha actualizado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    }
}