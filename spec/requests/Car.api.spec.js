const request = require('supertest');
const assert = require('assert');
const app = require("../../app/index.js");
const dotenv = require('dotenv')
dotenv.config();

describe('test index api', () => {
    it('return 200 ok', (done) => {
        request(app)
        .get("/")
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, done);
    });
});

describe('test api get all cars', () => {
    it('return 200 ok', (done) => {
        request(app)
        .get("/v1/cars")
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, done);
    });
});

describe('test api create car', () => {
    it('return 201 created', async() => {
        const loginAuth = {
            email: 'hilmi@gmail.com',
            password: 'hilmianakkampus'
        };

        await request(app)
        .post("/v1/auth/register")
        .send(loginAuth);

        const response = await request(app)
        .post("/v1/auth/login")
        .send(loginAuth);

        const token = `Bearer ${response.body.accessToken}`;

        const carPayload = {
            name: "Honda",
            price: 1000,
            size: "small"
        };

        await request(app)
        .post("/v1/cars")
        .set("Authorization", token)
        .send(carPayload)
        .expect(201)
        .expect("Content-Type", "application/json; charset=utf-8");


    });

    it('return 401 unauthorized access', async() => {
        const loginAuth = {
            email: 'akbar@gmail.com',
            password: 'akbaranakkorlap'
        };

        await request(app)
        .post("/v1/auth/register")
        .send(loginAuth);

        const response = await request(app)
        .post("/v1/auth/login")
        .send(loginAuth);

        const token = `Bearer ${response.body.accessToken}`;

        const carPayload = {
            name: "Honda",
            price: 1000,
            size: "small"
        };

        await request(app)
        .post("/v1/cars")
        .set("Authorization", token)
        .send(carPayload)
        .expect(401)
        .expect("Content-Type", "application/json; charset=utf-8");
    });
});

describe('test get car by id', () => {
    it('return 200 using valid id', () => {
        request(app)
        .get("/v1/cars/1")
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8");
    });

    it('return 404 using invalid id', () => {
        request(app)
        .get("/v1/cars/1000")
        .expect(404)
        .expect("Content-Type", "application/json; charset=utf-8");
    });
});