import mysql from "mysql2/promise";
import dbConfig from "../config/db.config";

const urlDB = `mysql://root:uDYwwhWKNaPQtKquiLLaPlEnKKMCZLpn@maglev.proxy.rlwy.net:52221/railway`;

const pool = mysql.createPool(urlDB);
// const pool = mysql.createPool({
//   host: dbConfig.HOST,
//   user: dbConfig.USER,
//   password: dbConfig.PASSWORD,
//   database: dbConfig.DB,
//   namedPlaceholders: true,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

export default pool;
