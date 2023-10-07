import { Request, Response } from "express";
import { Client } from "pg";
import getClient from "./client/elasticsearch";

class PhotoController {

    async importFromDatabase(request: Request, response: Response) {
        const client = new Client({
            host: '172.17.0.1', 
            port: 5432,
            database: 'postgre_to_elastic_db',
            user: 'admin',
            password: 'rootroot',
        });

        await client.connect();

        const { rows } = await client.query('SELECT * FROM PHOTOS');

        for await(let row of rows) {
            await getClient().index({
                index: 'photos',
                type: 'type_photos',
                body: row
            }, (err) => {
                if (err) {
                    return response.status(400).json({error: err});
                }
            })
        }
        return response.json({ message: 'Index ok!'});
    }

    async findAll(request: Request, response: Response) {
        
        const initial = new Date().getTime();

        const data = await getClient().search({
            index: 'photos',
            size: 6000
        });

        const final = new Date().getTime();

        console.log('O resultado do elasticsearch foi', (final - initial));
        
        return response.json(data);
    }

    async findById(request: Request, response: Response) {
        
        const { id } = request.params;

        const data = await getClient().search({
            index: 'photos',
            q: `id:${id}`
        });
        return response.json(data.hits.hits);
    }

    async create(request: Request, response: Response) {
        const photo = { 
            "id": 5001,
            "title": "Title de Teste",
            "url": "https://via.placeholder.com/600/74747742"
        }

        const data = await getClient().index({
            index: 'photos',
            type: 'type_photos',
            body: photo
        });
        return response.json(data);
    }

    async findByQuery(request: Request, response: Response) {

        const data = await getClient().search({
            index: 'photos',
            body: {
                query: {
                    match: {
                        "title.keyword": 'Title de Teste' // a frase exata
                    }
                }
            }
        });
        return response.json(data);
    }
}

export default new PhotoController;