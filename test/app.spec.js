
const app = require('../src/app')
const supertest = require('supertest')

describe('App', () => {
    it('GET / responds with 200 containing "Hello, world!"', () => {
        return supertest(app)
        .get('/')
        .expect(200, 'Hello, world!')
    })
})

describe('fail', () => {
    it('should return {} error if nothing sent', () => {
        return supertest(app)
            .post('/api/auth/login')
            .expect(401)
    })

    it('should return {} error if nothing sent', () => {
        return supertest(app)
            .post('/api/auth/signup')
            .expect(401)
    })

    it('should return {} error if nothing sent', () => {
        return supertest(app)
            .post('/api/auth/new')
            .expect(401)
    })
})

describe('successful', () => {
    const data = {

    };
    it('', () => {
        return supertest(app)
            .post('api/auth/signup')
            .send(data)
            .expect(201)
    })
})