import { Request, Response } from "express";
import { Client } from "pg";

class DBController {

    async findAll(request: Request, response: Response) {
        
        const initial = new Date().getTime();

        const client = new Client({
            host: '172.17.0.1', 
            port: 5432,
            database: 'postgre_to_elastic_db',
            user: 'admin',
            password: 'rootroot',
        });

        await client.connect();

        const { rows } = await client.query('SELECT * FROM PHOTOS');

        const final = new Date().getTime();

        console.log('O resultado do postgres foi', (final - initial));

        return response.json(rows);
    }
}

export default new DBController;