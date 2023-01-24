const mysql = require('mysql');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user:'root',
        password:'',
        database:'innomine1'
    }
);
db.connect(function(err){
 if (err)throw err;
 console.log('conectado a la base de datos');
});
module.exports=db;