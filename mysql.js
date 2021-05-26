const mysql = require('mysql2')

function create_connection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Azerty2+',
        database: 'javademo'
    })
}

async function get_users(connection) {
    const [rows, fields] = await connection.promise().query('SELECT email FROM users');
    return rows;
}

async function add_user(connection, login, mdp, email) {
    let stmt = `INSERT INTO users (login, mdp, email) VALUES(?,?,?)`;
    let values = [login, mdp, email];
    const [rows, fields] = await connection.promise().query(stmt, values, (err, results, fields) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('ID:' + results.insertId);
    });
}

module.exports = { create_connection, get_users, add_user };
