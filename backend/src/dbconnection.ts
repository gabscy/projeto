import  sql, {config as SqlConfig, ConnectionPool} from 'mssql';
import dotenv from 'dotenv';
dotenv.config();

const config: SqlConfig = {
    user: process.env.AZURE_SQL_USER as string,
    password: process.env.AZURE_SQL_PASSWORD as string,
    server: process.env.AZURE_SQL_SERVER as string,
    database: process.env.AZURE_SQL_DATABASE as string,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

let pool: ConnectionPool | null = null;

export async function getSqlConnection() {
    if (pool) {
        return pool;
    }
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (err) {
        console.error('SQL Connection Error:', err);
        throw err;
    }
}