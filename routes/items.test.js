process.env.NODE_ENV = 'test';


const request = require('supertest')

const app = require('../app')
let items = require('../fakeDB')


let pie = { name: "pie", price: 8 };

beforeEach(function() {
    items.push(pie);
});

afterEach(function() {
    items.length = 0
})

describe("GET /items", () => {
    test("Get all items", async () => {
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([pie])
    })
})

describe("POST /items", () => {
    test("Create new item", async () => {
        const res = await request(app).post('/items').send({name: "fritos", price: 12.5});
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({added: {name: "fritos", price: 12.5}})
        expect(items.length).toEqual(2)
    })
    test("Responds with 404 for missing name", async () => {
        const res = await request(app).post('/items').send({price: 2});
        expect(res.statusCode).toBe(400)
        expect(items.length).toEqual(1)
    })
    test("Responds with 404 for missing price", async () => {
        const res = await request(app).post('/items').send({namee: "cheetos"});
        expect(res.statusCode).toBe(400)
        expect(items.length).toEqual(1)
    })
})


describe("GET /items/:name", () => {
    test("Get item by name", async () => {
        const res = await request(app).get('/items/pie');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({item : pie })
    })
    test("Responds with 404 for invalid name", async () => {
        const res = await request(app).get('/items/popcorn');
        expect(res.statusCode).toBe(404)
        expect(res.body).toEqual({error: "Item not found"})
    })
})


describe("PATCH /items/:name", () => {
    test("Updates item name by name", async () => {
        const res = await request(app).patch('/items/pie').send({name: "tort"});
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({updated: {name: "tort", price: 8}})
    })
    test("Updates item price by name", async () => {
        const res = await request(app).patch('/items/tort').send({price: 10});
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({updated: {name: "tort", price: 10}})
    })
})

describe("DELETE /items/:name", () => {
    test("Delete item by name", async () => {
        const res = await request(app).delete('/items/pie');
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({message: "Deleted"})
        expect(items.length).toBe(0)
    })
})