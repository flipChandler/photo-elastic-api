import express, { Request, Response } from 'express';
import getClient from './client/elasticsearch';
import DBController from './DBController';
import PhotoController from './PhotoController';


const app = express();

app.get('', async(request: Request, response: Response) => {
    
    const client = getClient();

    const result = await client.index({
        index: 'elastic_teste',
        type: 'type_elastic_teste',
        body: {
            user: 'Felipe',
            password: 'gddghhdjak',
            email: 'felipe@gmail.com'
        }
    });
    return response.json(result);
});

app.get('/db/photos', DBController.findAll);
app.get('/elastic/photos/import', PhotoController.importFromDatabase);
app.get('/elastic/photos/', PhotoController.findAll);
app.get('/elastic/photos/create', PhotoController.create);
app.get('/elastic/photos/query', PhotoController.findByQuery);
app.get('/elastic/photos/:id', PhotoController.findById);

app.listen(3333, () => console.log('running'));