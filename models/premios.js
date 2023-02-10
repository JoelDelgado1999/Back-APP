const db = require('../config/config');

const Premios = {};
Premios.create = (order, result) => {

    const sql = `
    INSERT INTO
        solicitudes_premios(
            id_client,
            premio,
            status
            timestamp,
            created_at,
            evidencia,
            cantidad_aprox,
            nombre_evidencia
             )
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql, 
        [
            order.id_client,
            order.id_address,
            order.id_wallet_history,
            order.lat,
            order.lng,
            'EN ESPERA', 
            Date.now(),
            new Date(),
            order.evidencia,
            order.cantidad_aprox,
            order.nombre_evidencia,
        
    
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                console.log('timestap',Date.now);
            
                result(err, null);
            }
            else {
                console.log('Id de la nueva orden:', res.insertId);
                console.log('timestap',Date.now);
                result(null, res.insertId);
            }
        }

    )

}
module.exports = Premios;