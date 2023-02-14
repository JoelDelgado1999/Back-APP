const User = require('../models/user');
const Order = require('../models/order');
const Rol = require('../models/rol');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage');

module.exports = {

    findCentros(req, res) {
        User.findCentros((err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con al listar los centros de acopio',
                    error: err
                });
            }


            return res.status(201).json(data);
        });
    },


    delete(req, res) {
        console.log('req', req.params.id_user);
        User.delete(req.params.id_user, (err) => {
            if (err) {
                return res.status(501).json({
                    data: null,
                    success: false,
                    message: 'Hubo un error al borrar',
                    error: err
                });
            }

            return res.status(201).json({
                data: null,
                success: true,
                message: 'se borro con exito',
                // EL ID DE LA NUEVA DIRECCION
            });



        })

    },




    login(req, res) {

        const email = req.body.email;
        const password = req.body.password;
        console.log(email)
        User.findByEmail(email, async (err, myUser) => {

            console.log('Error ', err);

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el logeo del usuario',
                    error: err
                });
            }

            if (!myUser) {
                return res.status(401).json({ // EL CLIENTE NO TIENE AUTORIZACION PARTA REALIZAR ESTA PETICION (401)
                    success: false,
                    message: 'El email no fue encontrado'
                });
            }

            const isPasswordValid = await bcrypt.compare(password, myUser.password);

            if (isPasswordValid) {
                const token = jwt.sign({ id: myUser.id, email: myUser.email }, keys.secretOrKey, {});

                const data = {
                    id: `${myUser.id}`,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image, puntos: myUser.puntos,
                    session_token: `JWT ${token}`,

                    //roles: JSON.parse(myUser.roles)
                    rol: { name: myUser.rol, id: myUser.id_rol },
                    role: myUser.id_rol,
                }

                return res.status(201).json({
                    success: true,
                    message: 'El usuario fue autenticado',
                    data: data // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
                });

            }
            else {
                return res.status(401).json({ // EL CLIENTE NO TIENE AUTORIZACION PARTA REALIZAR ESTA PETICION (401)
                    success: false,
                    message: 'El password es incorrecto'
                });
            }

        });

    },


    async asignarpuntosHistory2(req, res) {

        // const id_client = req.params.id_client;
        //const puntos  = req.body;
        // print("eror",puntos)
        const user = req.body
        console.log('ss', user);


        let puntos = user.kg
        console.log("puntosss kg", puntos);
        puntos = puntos * 2

        resultPuntos = puntos
        console.log("result", resultPuntos);

        console.log("order id", user.id_usuario.id);

        User.asignarhistory2(user.id_usuario.id_client, user.id_usuario.id, async (err, id) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la asignacion de puntos',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'Los puntos se asignaron',
                data: `${id}` // EL ID DE LA NUEVA DIRECCION
            });




        },
        Order.GetWalletByClientId(user.id_usuario.id_client, (err, data) => {
           
            
           const  HistorialBilletera =  data ;
            
           let acumulador =0;
           for(const a of HistorialBilletera ){

             acumulador = a.puntos + acumulador;


            

           }
          /* const response = { historialWallet: data, totalPuntosBilletera : acumulador  }
            
          


            return res.status(201).json(response);*/
  Order.update_user_wallet( acumulador,user.id_usuario.id_client,  async (err, id) => {

                console.log('data',user.id_usuario.id_client,acumulador);
                  console.log('subido');
     
                     
     
             }); 
 Order.update_user_puntos( acumulador,user.id_usuario.id_client,  async (err, id) => {

                console.log('data',user.id_usuario.id_client,acumulador);
                  console.log('subido');
     
                     
     
             }); 
Order.update_puntos_ordenes( resultPuntos,user.id_usuario.id,  async (err, id) => {

                console.log('dataresultpuntos',user.id_usuario.id);
                  console.log('subido ordenes puntos');
     
                     
     
             }); 

        })
        );

    },

    register(req, res) {

        const user = req.body; // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE
        User.create(user, (err, data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente',
                data: data // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
            });

        });

    },
    async registerWithImage(req, res) {

        const user = JSON.parse(req.body.user); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

        const files = req.files;

        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                user.image = url;
            }
        }

        User.create(user, (err, data) => {


            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }


            user.id = `${data}`;
            const token = jwt.sign({ id: user.id, email: user.email }, keys.secretOrKey, {});
            user.session_token = `JWT ${token}`;

            Rol.create(user.id, 3, (err, data) => {

                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del rol de usuario',
                        error: err
                    });
                }

                return res.status(201).json({
                    success: true,
                    message: 'El registro se realizo correctamente',
                    data: user
                });

            });

           

        });

        }

        


        

    },
    registroCentros(req, res) {
        const user = req.body; // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE





        User.create(user, (err, data) => {


            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }


            user.id = `${data}`;
            const token = jwt.sign({ id: user.id, email: user.email }, keys.secretOrKey, {});
            user.session_token = `JWT ${token}`;

            Rol.create(user.id, 2, (err, data) => {

                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del rol de usuario',
                        error: err
                    });
                }

                return res.status(201).json({
                    success: true,
                    message: 'El centro de acopio se realizo correctamente',
                    data: user
                });

            });



        });

    },










    async updateWithImage(req, res) {
        const user = JSON.parse(req.body.user); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

        const files = req.files;

        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                user.image = url;
            }
        }
        User.update(user, (err, data) => {


            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            User.findById(data, (err, myData) => {
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del usuario',
                        error: err
                    });
                }

                myData.session_token = user.session_token;
                //myData.roles = JSON.parse(myData.roles);

                return res.status(201).json({
                    success: true,
                    message: 'El usuario se actualizo correctamente',
                    data: myData
                });
            })
        });

    },
    async updateCentroAcopio(req, res) {
        console.log(req)
        const user = req.body; // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

        User.updateCentroAcopio(req.params.id, user, (err, data) => {


            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }
            return res.status(201).json({
                success: true,
                message: 'El usuario se actualizo correctamente',
                data: user
            });
          


        });
    },
    async updateWithoutImage(req, res) {

        const user = req.body; // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

        User.updateWithoutImage(user, (err, data) => {


            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            User.findById(data, (err, myData) => {
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del usuario',
                        error: err
                    });
                }

                myData.session_token = user.session_token;
                myData.roles = JSON.parse(myData.roles);

                return res.status(201).json({
                    success: true,
                    message: 'El usuario se actualizo correctamente',
                    data: myData
                });
            })


        });

    },


    async updateNotificationToken(req, res) {

        const id = req.body.id;
        const token = req.body.token;

        User.updateNotificationToken(id, token, (err, id_user) => {


            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error actualizando el token de notificaciones del usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El token se actualizo correctamente',
                data: id_user
            });

        });

    },

    async loginAdminDashboard(req, res) {
        const email = req.body.email;
        const password = req.body.password;
        User.findByEmailDashBoard(email, async (err, myUser) => {

            if (err)
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });


            if (!myUser)
                return res.status(401).json({ // EL CLIENTE NO TIENE AUTORIZACION PARTA REALIZAR ESTA PETICION (401)
                    success: false,
                    message: 'El email no fue encontrado'
                });

            const isPasswordValid = await bcrypt.compare(password, myUser.password);
            if (isPasswordValid) {
                const token = jwt.sign({ id: myUser.id, email: myUser.email }, keys.secretOrKey, {});

                const data = {
                    id: myUser.id,
                    name: myUser.name,
                    session_token: `JWT ${token}`,
                    email: myUser.email

                }

                return res.status(201).json({
                    success: true,
                    message: 'El usuario fue autenticado',
                    data: data // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
                });

            }
            else {
                return res.status(401).json({ // EL CLIENTE NO TIENE AUTORIZACION PARTA REALIZAR ESTA PETICION (401)
                    success: false,
                    message: 'El password es incorrecto'
                });
            }
        })




    }



}
    /*login(req, res){
const email = req.body.email;
const password = req.body.password;


User.findByEmail(email,async(err, myUser) => {
console.log('USUARIO',myUser);
console.log('ERROSR',err);

if (err) {
    return res.status(501).json({
        success: false,
        message: 'Hubo un error con el registro del usuario',
        error: err
    });
}
if(!myUser){
    return res.status(401).json({//cliente no tiene autorizacion para realizar esta peticion
        success: false,
        message: 'email no fue encontrado',
 
    });
}

const isPasswordValid = await bcrypt.compare(password,myUser.password);
if(isPasswordValid){
    const token = jwt.sign({id: myUser.id, email: myUser.email}, keys.secretOrKey,{})
    const data ={
        id : `${myUser.id}`,
        name: myUser.name,
        lastname: myUser.lastname,
        email: myUser.email,
        phone: myUser.phone,
        image: myUser.image,
        session_token:`JWT ${token}`,
        roles:JSON.parse(myUser.roles),
        
    }
    return res.status(201).json({
        success: true,
        message: 'El usuario fue autenticado',
        data: data // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
    });
}
else{
    return res.status(401).json({//cliente no tiene autorizacion para realizar esta peticion
        success: false,
        message: 'la contraseña es incorrecta ',
 
    });

}

});

},

register(req, res) {

const user = req.body; // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE
User.create(user, (err, data) => {

if (err) {
    return res.status(501).json({
        success: false,
        message: 'Hubo un error con el registro del usuario',
        error: err
    });
}
return res.status(201).json({
    success: true,
    message: 'Tu cuenta de usuario a sido creada con exito',
    data: data // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
});
 
});
},
async registerWithImage(req, res) {

const user = JSON.parse(req.body.user); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

const files = req.files;

if (files.length > 0) {
const path = `image_${Date.now()}`;
const url = await storage(files[0], path);

if (url != undefined && url != null) {
    user.image = url;
}
}

User.create(user, (err, data) => {

 
if (err) {
    return res.status(501).json({
        success: false,
        message: 'Hubo un error con el registro del usuario',
        error: err
    });
}
 
user.id = `${data}`;
const token = jwt.sign({id: user.id, email: user.email}, keys.secretOrKey,{})
user.session_token=`JWT ${token}`; 
Rol.create(user.id,3,(err,data)=>{
    if (err) {
        return res.status(501).json({
            success: false,
            message: 'Hubo un error con el registro del rol de usuario',
            error: err
        });
    }
    return res.status(201).json({
        success: true,
        message: 'tu cuenta de usuario a sido creada con exito',
        data: user
    });
});
 
 

});

},
async updateWithImage(req, res) {

const user = JSON.parse(req.body.user); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

const files = req.files;

if (files.length > 0) {
const path = `image_${Date.now()}`;
const url = await storage(files[0], path);

if (url != undefined && url != null) {
    user.image = url;
}
}

User.update(user, (err, data) => {

 
if (err) {
    return res.status(501).json({
        success: false,
        message: 'Hubo un error con el registro del usuario',
        error: err
    });
}

User.findById(data, (err, myData) => {
    if (err) {
        return res.status(501).json({
            success: false,
            message: 'Hubo un error con el registro del usuario',
            error: err
        });
    }
    
    myData.session_token = user.session_token;
    myData.roles = JSON.parse(myData.roles);

    return res.status(201).json({
        success: true,
        message: 'El usuario se actualizo correctamente',
        data: myData
    });
})
});

},

async updateWithoutImage(req, res) {

const user = req.body; // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

User.updateWithoutImage(user, (err, data) => {

 
if (err) {
    return res.status(501).json({
        success: false,
        message: 'Hubo un error con el registro del usuario',
        error: err
    });
}

User.findById(data, (err, myData) => {
    if (err) {
        return res.status(501).json({
            success: false,
            message: 'Hubo un error con el registro del usuario',
            error: err
        });
    }
    
    myData.session_token = user.session_token;
    myData.roles = JSON.parse(myData.roles);

    return res.status(201).json({
        success: true,
        message: 'El usuario se actualizo correctamente',
        data: myData
    });
})

 
});

}, */


