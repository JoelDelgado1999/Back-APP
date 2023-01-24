const Premios= require('../models/premios');
module.exports = {

    getAll(req, res) {
        
        Premios.getAll( (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al tratar de obtener los premios',
                    error: err
                });
            }

            return res.status(201).json(data);
        })
    },
}




