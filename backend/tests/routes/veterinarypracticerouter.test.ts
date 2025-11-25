import request from 'supertest'
import { app } from '../../src/app';
import { VeterinaryPracticeSearchBodyType } from 'vetlib-shared/schemas/ZodSchemas';


describe('/api/veterinary-practice', () => {
    describe('/all', () => {
        it('', async () => {
            const response = await request(app)
                .get('/api/veterinary-practice/all');

            console.log(response.body);
        })
    })

    describe('/search', () => {
        it('responds with json', async () => {
            // TODO: add sometime later
            const requestData: VeterinaryPracticeSearchBodyType = {
                name: '',
                address: ''
            };
            const response = await request(app)
                .get('/api/veterinary-practice/search')
                .send(requestData);

            console.log(response.body);
        });
    });
});
