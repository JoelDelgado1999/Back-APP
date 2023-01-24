const db = require('../config/config');

const Premios = {};
Premios.getAll= ( result) => {
    const sql = `
    SELECT
        CONVERT(id, char) AS id,
        nombre,
        imagen,
        cantidad_puntos
    FROM
        premios
 
    `;

    db.query(
        sql, 

        (err, data) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, data);
            }
        }

    )
},
module.exports = Premios;