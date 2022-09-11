const mysql = require('mysql');

// buat konfigurasi koneksi
const koneksi = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wa_api',
    // port:3307,
    multipleStatements: true,
});

module.exports = koneksi;