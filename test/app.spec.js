
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
    const signUpData = {
        username: 'joe',
        email: 'joe@gmail.com',
        password: 'joesephJ1!'
    };
    it('successful signup', () => {
        return supertest(app)
            .post('api/auth/signup')
            .send(signUpData)
            .expect(201)
    })
    const loginData = {
        username: 'jordan',
        password: 'Jordan1!'
    }
    it('successful login', () => {
        return supertest(app)
            .post('/api/auth/login')
            .send(loginData)
            .expect(200)
    })
})