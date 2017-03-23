"use strict";
const app_1 = require("../app");
const request = require('supertest');
describe('GET /', () => {
    it('should return 200 OK', (done) => {
        request(app_1.App)
            .get('/')
            .expect(200, done);
    });
});
describe('GET /login', () => {
    it('should return 200 OK', (done) => {
        request(app_1.App)
            .get('/login')
            .expect(200, done);
    });
});
describe('GET /signup', () => {
    it('should return 200 OK', (done) => {
        request(app_1.App)
            .get('/signup')
            .expect(200, done);
    });
});
describe('GET /api', () => {
    it('should return 200 OK', (done) => {
        request(app_1.App)
            .get('/api')
            .expect(200, done);
    });
});
describe('GET /contact', () => {
    it('should return 200 OK', (done) => {
        request(app_1.App)
            .get('/contact')
            .expect(200, done);
    });
});
describe('GET /random-url', () => {
    it('should return 404', (done) => {
        request(app_1.App)
            .get('/reset')
            .expect(404, done);
    });
});
//# sourceMappingURL=app.js.map