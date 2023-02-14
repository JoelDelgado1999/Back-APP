const db = require('../config/config');

const Order = {};

Order.create = (order, result) => {

    const sql = `
    INSERT INTO
        orders(
            id_client,
            id_address,
            id_wallet_history,
            lat,
            lng,
            status,
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

Order.create = (order, result) => {

    const sql = `
    INSERT INTO
        orders(
            id_client,
            id_address,
            id_wallet_history,
            lat,
            lng,
            status,
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
Order.AceptarOrdenEmpresa = (id_order, id_empresa,result) => {
    const sql = `
    UPDATE
        orders
    SET
        id_empresa = ?,
        status = ?
    WHERE
        id = ?
    `;

    db.query(
        sql, 
        [    
            id_empresa,
            'ACEPTADO',
            id_order
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, id_order);
            }
        }
    )
}

Order.RechazarOrdenEmpresa = (id_order, id_empresa,result) => {
    const sql = `
    UPDATE
        orders
    SET
        id_empresa = ?,
        status = ?
    WHERE
        id = ?
    `;

    db.query(
        sql, 
        [    
            id_empresa,
            'RECHAZADA',
            id_order
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, id_order);
            }
        }
    )
}






Order.createCentros = (order, result) => {

    const sql = `
    INSERT INTO
        solicitudes_centros (
            id_client,
            status,
            evidencia,
            timestamp,
            created_at,
            nombre_evidencia,
            cantidad_aprox
             )
    VALUES(?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql, 
        [
            order.id_client,
            'EN ESPERA', 
            order.evidencia,
            Date.now(),
            new Date(),  
            order.nombre_evidencia,
            order.cantidad_aprox,
   
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

Order.findByOrder = (status ,result) => {
    const sql = `
    SELECT
        CONVERT(O.id, char) AS id,
        CONVERT(O.id_client, char) AS id_client,
        CONVERT(O.id_delivery, char) AS id_delivery,
        O.lat,
        O.lng,
        O.status,
        O.evidencia,
        O.cantidad_aprox,
        O.timestamp,
        O.nombre_evidencia,
        O.created_at,
        JSON_OBJECT(
            'id', CONVERT(A.id, char),
            'address', A.address,
            'neighborhood', A.neighborhood,
            'lat', A.lat,
            'lng', A.lng
        ) AS address,
        JSON_OBJECT(
            'id', CONVERT(U.id, char),
            'name', U.name,
            'lastname', U.lastname,
            'image', U.image,
            'phone', U.phone
        ) AS client,
        JSON_OBJECT(
            'id', CONVERT(U2.id, char),
            'name', U2.name,
            'lastname', U2.lastname,
            'image', U2.image,
            'phone', U2.phone
        ) AS delivery
    FROM 
        orders AS O
    INNER JOIN
        users AS U
    ON
        U.id = O.id_client
	LEFT JOIN
		users AS U2
	ON
		U2.id = O.id_delivery
    INNER JOIN
        address AS A
    ON
        A.id = O.id_address 
    
    WHERE 
        status = ?
    GROUP BY
        O.id
	ORDER BY
		O.timestamp;
    `;


    db.query(
        sql, 
        status,
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
    
}


Order.findSolicitudesCentros = (status ,result) => {
    const sql = `
    SELECT
        CONVERT(O.id, char) AS id,
        CONVERT(O.id_client, char) AS id_client,
        CONVERT(O.id_empresa, char) AS id_empresa,
        O.status
        O.evidencia,
        O.timestamp,
        O.created_at,
        O.nombre_evidencia,
        O.nombre_evidencia,
        O.cantidad_aprox,
        JSON_OBJECT(
            'id', CONVERT(U.id, char),
            'name', U.name,
            'lastname', U.lastname,
            'image', U.image,
            'phone', U.phone
        ) AS client,
        JSON_OBJECT(
            'id', CONVERT(U2.id, char),
            'name', U2.name,
            'lastname', U2.lastname,
            'image', U2.image,
            'phone', U2.phone
        ) AS empresa
    FROM 
        solicitudes_centros AS O
    INNER JOIN
        users AS U
    ON
        U.id = O.id_client
	LEFT JOIN
		users AS U2
	ON
		U2.id = O.id_empresa 
    
    WHERE 
        status = EN CAMINO
 
	ORDER BY
		O.timestamp;
    `;


    db.query(
        sql, 
        status,
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
    
}









Order.GetWalletByClientId = (id_user, result) => {

    const sql = `
    SELECT
    O.status,
    O.puntos,
    O.created_at
   
FROM 
    wallet_history AS O
INNER JOIN
    users AS U
ON
    U.id = O.user_id

INNER JOIN
    orders AS A
ON
    A.id = O.id_orden 
WHERE 
    O.user_id = ? AND O.status = "ACEPTADO" ;
    `;

    db.query(
        sql, 
        [
            id_user
        ],
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
Order.findByClientAndStatus = (id_client, status, result) => {

    const sql = `
    SELECT
        CONVERT(O.id, char) AS id,
        CONVERT(O.id_client, char) AS id_client,
        CONVERT(O.id_delivery, char) AS id_delivery,
        O.lat,
        O.lng,
        O.status,
        O.timestamp,
        O.evidencia,
        O.cantidad_aprox,
        O.nombre_evidencia,
        O.puntos,
        O.created_at,
    JSON_OBJECT(
        'id', CONVERT(A.id, char),
        'address', A.address,
        'neighborhood', A.neighborhood,
        'lat', A.lat,
        'lng', A.lng
    ) AS address,
    JSON_OBJECT(
            'id', CONVERT(U.id, char),
            'name', U.name,
            'lastname', U.lastname,
            'image', U.image,
            'phone', U.phone
        ) AS client,
        JSON_OBJECT(
            'id', CONVERT(U2.id, char),
            'name', U2.name,
            'lastname', U2.lastname,
            'image', U2.image,
            'phone', U2.phone
        ) AS delivery   
    FROM 
        orders AS O
    INNER JOIN
        users AS U
    ON
        U.id = O.id_client
	LEFT JOIN
		users AS U2
	ON
		U2.id = O.id_delivery
    INNER JOIN
        address AS A
    ON
        A.id = O.id_address 

   

        
    WHERE 
        O.id_client = ? AND O.status = ?
    GROUP BY
        O.id
     ORDER BY
		O.timestamp DESC;
    `;

    db.query(
        sql,
        [
            id_client,
            status
        ],
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
Order.findByDeliveryAndStatus = (id_delivery, status, result) => {

    const sql = `
    SELECT
        CONVERT(O.id, char) AS id,
        CONVERT(O.id_client, char) AS id_client,
        CONVERT(O.id_address, char) AS id_address,
        CONVERT(O.id_delivery, char) AS id_delivery,
        O.lat,
        O.lng,
        O.status,
        O.evidencia,
        O.cantidad_aprox,
        O.timestamp,
        O.nombre_evidencia,
        O.created_at,
        JSON_OBJECT(
            'id', CONVERT(A.id, char),
            'address', A.address,
            'neighborhood', A.neighborhood,
            'lat', A.lat,
            'lng', A.lng
        ) AS address,
        JSON_OBJECT(
            'id', CONVERT(U.id, char),
            'name', U.name,
            'lastname', U.lastname,
            'image', U.image,
            'phone', U.phone
        ) AS client,
        JSON_OBJECT(
            'id', CONVERT(U2.id, char),
            'name', U2.name,
            'lastname', U2.lastname,
            'image', U2.image,
            'phone', U2.phone
        ) AS delivery
    FROM 
        orders AS O
    INNER JOIN
        users AS U
    ON
        U.id = O.id_client
	LEFT JOIN
		users AS U2
	ON
		U2.id = O.id_delivery
    INNER JOIN
        address AS A
    ON
        A.id = O.id_address 
    
    WHERE 
        O.id_delivery = ? AND O.status = ?
    GROUP BY
        O.id
	ORDER BY
		O.timestamp;
    `;

    db.query(
        sql,
        [
            id_delivery,
            status
        ],
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
}

Order.updateToOnInomine = (id_order, id_delivery,result) => {
    const sql = `
    UPDATE
        solicitudes_centros
    SET
        id_delivery = ?,
        status = ?
    WHERE
        id = ?
    `;

    db.query(
        sql, 
        [    
            id_delivery,
            'ACEPTADO',
            id_order
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, id_order);
            }
        }
    )
}
Order.updateToOfInomine = (id_order, id_delivery,result) => {
    const sql = `
    UPDATE
        solicitudes_centros
    SET
        id_delivery = ?,
        status = ?
    WHERE
        id = ?
    `;

    db.query(
        sql, 
        [    
            id_delivery,
            'RECHAZADO',
            id_order
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, id_order);
            }
        }
    )
}





Order.updateToOnTheWay = (id_order, id_delivery,result) => {
    const sql = `
    UPDATE
        orders
    SET
        id_delivery = ?,
        status = ?
    WHERE
        id = ?
    `;

    db.query(
        sql, 
        [    
            id_delivery,
            'EN CAMINO',
            id_order
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, id_order);
            }
        }
    )
}
Order.updateToOFTheWay = (id_order, result) => {
    const sql = `
    UPDATE
        orders
    SET
        status = ?
    WHERE
        id = ?
    `;

    db.query(
        sql, 
        [    
            'RECHAZADA',
            id_order
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, id_order);
            }
        }
    )
}







Order.update_user_wallet= (acumulador,id_client, result) => {

    const sql = `
    UPDATE
    user_wallet
        SET
            puntos = ?
            
        WHERE
            id_client = ?
`;

    db.query
    (
        sql,
        [
           
           acumulador,
           id_client
           
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('puntos asignados:', res.insertId);
                result(null, res.insertId);
            }
        }
    )
}

Order.update_user_puntos= (resultPuntos,id_client, result) => {

    const sql = `
    UPDATE
    users
        SET
            puntos = ?
            
        WHERE
            id = ?
`;

    db.query
    (
        sql,
        [
           
           resultPuntos,
           id_client
           
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('puntos asignados:', res.insertId);
                result(null, res.insertId);
            }
        }
    )
}


Order.update_puntos_ordenes= (resultPuntos,id_order, result) => {

    const sql = `
    UPDATE
    orders
        SET
            puntos = ?
            
        WHERE
            id = ?
`;

    db.query
    (
        sql,
        [
           
           resultPuntos,
           id_order
           
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('puntos asignados:', res.insertId);
                result(null, res.insertId);
            }
        }
    )
}


Order.recolectado = (id_order, result) => {
    const sql = `
    UPDATE
        orders
    SET
        
        status = ?
    WHERE
        id = ?
    `;

    db.query(
        sql, 
        [
            'ENTREGADO',
            id_order
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, id_order);
            }
        }
    )
}

Order.updateLatLng = (order, result) => {
    const sql = `
    UPDATE
        orders
    SET
        lat = ?,
        lng = ?
    WHERE
        id = ?
    `;

    db.query(
        sql, 
        [
            order.lat,
            order.lng,
            order.id
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, order.id);
            }
        }
    )
}
module.exports = Order;

