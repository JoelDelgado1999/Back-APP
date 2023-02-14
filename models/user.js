const db = require('../config/config');
const bcrypt = require('bcryptjs');

const User = {};




User.findById = (id, result) => {

    const sql = `
    SELECT
        CONVERT(U.id, char) AS id,
        U.email,
        U.name,
        U.lastname,
        U.image,
        U.phone,
        U.password,
        U.puntos,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', CONVERT(R.id, char),
                'name', R.name,
                'image', R.image
            )
        ) AS roles
    FROM
        users AS U
    INNER JOIN
        user_has_roles AS UHR
    ON
        UHR.id_user = U.id
    INNER JOIN
        roles AS R
    ON
        UHR.id_rol = R.id
    WHERE
        U.id = ?
    GROUP BY
        U.id
    `;

    db.query(
        sql,
        [id],
        (err, user) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                result(null, user[0]);
            }
        }
    )

},
User.findByEmail = (email, result) => {

    const sql = `
    SELECT
        R.name AS rol,
        R.id AS id_rol, 
        U.id,
        U.email,
        U.name,
        U.lastname,
        U.image,
        U.phone,
        U.password,
        U.puntos,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', CONVERT(R.id, char),
                'name', R.name,
                'image', R.image
            )
        ) AS roles
    FROM
        users AS U
    INNER JOIN
        user_has_roles AS UHR
    ON
        UHR.id_user = U.id
    INNER JOIN
        roles AS R
    ON
        UHR.id_rol = R.id
    WHERE
        email = ?
    GROUP BY
        U.id
    `;

    db.query(
        sql,
        [email],
        (err, user) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Usuario obtenido:', user[0]);
                result(null, user[0]);
            }
        }
    )

}
User.delete = (user, result) => {
    const sql = `
    DELETE FROM user WHERE id =?
    `;
    db.query(
        sql, 
        [
            user,
            
        ],
        (err, res) => {
            if (err) {
                console.log('Errror:', err);
                result(err);
            }
            else {
                console.log('Id de la nueva direccion borrada:',user);
                result(null);
            }
        }

    )
}
User.findCentros= (result) => {
    const sql = `
    SELECT
        CONVERT(U.id, char) AS id,
        U.ci,
        U.email,
        U.name,
        U.lastname,
        U.image,
        U.phone
    FROM
        users AS U
    INNER JOIN
        user_has_roles AS UHR
    ON
        UHR.id_user = U.id 
    INNER JOIN
        roles AS R
    ON
        R.id = UHR.id_rol
    WHERE
        R.id = 2;
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
    );
}




User.findUser = (status ,result) => {
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





User.create = async (user, result) => {
    
    const hash = await bcrypt.hash(user.password, 10);

    const sql = `
        INSERT INTO
            users(
                email,
                name,
                lastname,
                phone,
                image,
                password,
                puntos,
                created_at
            )
        VALUES(?, ?, ?, ?, ?, ?, ? ,?)
    `;

    db.query
    (
        sql,
        [
            user.email,
            user.name,
            user.lastname,
            user.phone,
            user.image,
            hash,
            0,
            new Date(),
           
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Id del nuevo usuario:', res.insertId);
                result(null, res.insertId);
            }
        }
    )

}

User.create_user_wallet = async (user_id, result) => {
    

    const sql = `
        INSERT INTO
            user_wallet(
               id_client,
               puntos,
               created_at
            )
        VALUES(?, ?, ?)
    `;

    db.query
    (
        sql,
        [
            user_id,
            0,
            new Date(),
           
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Id del nuevo usuario_wallet:', res.insertId);
                result(null, res.insertId);
            }
        }
    )

}































User.asignarhistory2 = (id_client,id , result) => {

    const sql = `
    INSERT INTO
    wallet_history (
        user_id,
        status,
        puntos,
        id_orden
      ) 
VALUES(?, ?, ?, ?)
    `;

    db.query
    (
        sql,
        [
           id_client,
           "ACEPTADO",
           resultPuntos,
           id,
            
           //user.resultPuntos
           
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
/*User.asignarhistory = (id_order, result) => {

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
}*/
User.update = (user, result) => {

    const sql = `
    UPDATE
        users
    SET
        name = ?,
        lastname = ?,
        phone = ?,
        image = ?
    WHERE
        id = ?
    `;

    db.query
    (
        sql,
        [
            user.name,
            user.lastname,
            user.phone,
            user.image,
            user.id
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Usuario actualizado:', user.id);
                result(null, user.id);
            }
        }
    )
}

User.updateWithoutImage = (user, result) => {

    const sql = `
    UPDATE
        users
    SET
        name = ?,
        lastname = ?,
        phone = ?
    WHERE
        id = ?
    `;

    db.query
    (
        sql,
        [
            user.name,
            user.lastname,
            user.phone,
        
            user.id
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Usuario actualizado:', user.id);
                result(null, user.id);
            }
        }
    )
}




module.exports = User;