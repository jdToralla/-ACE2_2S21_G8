const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);
const axios = require('axios');

jest.mock('axios');

describe('Api de catalogo', () => {
    it('Validacion de estado esperado', async done => {
        axios.get.mockResolvedValueOnce({
            data: [
                {
                    "id": "1",
                    "name": "Google Play",
                    "image": "https://media.karousell.com/media/photos/products/2020/5/21/rm50_goggle_play_gift_card_mal_1590040469_c1100b5a_progressive.jpg",
                    "chargeRate": 1,
                    "active": true,
                    "availability": [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    "id": "2",
                    "name": "PlayStation",
                    "image": "https://www.allkeyshop.com/blog/wp-content/uploads/PlayStationNetworkGiftCard.jpg",
                    "chargeRate": 0.25,
                    "active": true,
                    "availability": [
                        1,
                        2,
                        3
                    ]
                }
            ]
        })
        axios.get.mockResolvedValueOnce({
            data: [
                {
                    "id": "1",
                    "total": "10"
                },
                {
                    "id": "2",
                    "total": "25"
                },
                {
                    "id": "3",
                    "total": "50"
                },
                {
                    "id": "4",
                    "total": "100"
                }
            ]
        })
       
        var res = await request.get('/catalog');

        expect(res.status).toBe(200);
        done();
    });
    it('Validacion de campos de elementos', async done => {
        axios.get.mockResolvedValueOnce({
            data: [
                {
                    "id": "1",
                    "name": "Google Play",
                    "image": "https://media.karousell.com/media/photos/products/2020/5/21/rm50_goggle_play_gift_card_mal_1590040469_c1100b5a_progressive.jpg",
                    "chargeRate": 1,
                    "active": true,
                    "availability": [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    "id": "2",
                    "name": "PlayStation",
                    "image": "https://www.allkeyshop.com/blog/wp-content/uploads/PlayStationNetworkGiftCard.jpg",
                    "chargeRate": 0.25,
                    "active": true,
                    "availability": [
                        1,
                        2,
                        3
                    ]
                }
            ]
        })
        axios.get.mockResolvedValueOnce({
            data: [
                {
                    "id": "1",
                    "total": "10"
                },
                {
                    "id": "2",
                    "total": "25"
                },
                {
                    "id": "3",
                    "total": "50"
                },
                {
                    "id": "4",
                    "total": "100"
                }
            ]
        })
        
        var res = await request.get('/catalog');
        var items = res.body;
        if (items.length > 0) {
            items.map(item => {
                expect(item).toHaveProperty('id');
                expect(item).toHaveProperty('name');
                expect(item).toHaveProperty('image');
                expect(item).toHaveProperty('chargeRate');
                expect(item).toHaveProperty('availability');
            });
        }
        expect(res.status).toBe(200);
        done();
    });
});