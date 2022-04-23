const request = require('supertest');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const user1ID = new mongoose.Types.ObjectId()
const user1 = {
    _id: user1ID,
    name: 'Mike',
    email: 'mike@mail.com',
    password: 'exmpasss',
    tokens: [{
        token: jwt.sign({ _id: user1ID}, process.env.SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(user1).save()
})

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Alex',
        email: 'alex@mail.com',
        password: 'exmpasss'
    }).expect(201);

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
        user: {
            name: 'Alex',
            email: 'alex@mail.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('exmpasss')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send(user1).expect(200)
    const user = await User.findById(response.body.user._id);
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login non-existing user', async () => {
    await request(app).post('/users/login').send({
        email: 'invalid@mail.com',
        password: 'password123'
    }).expect(400)
})

test('Should get profile for user', async ()=> {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for user', async ()=> {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})


test('Should delete profile for user', async ()=> {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(user1._id);
    expect(user).toBeNull();
})

test('Should not delete profile for user', async ()=> {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar for user', async ()=> {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .attach('avatar', './tests/fixtures/profile-pic.jpg')
        .expect(200)
})

test('Should update email for user', async ()=> {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            email: 'newmail@mail.com'
        })
        .expect(200)

    const user = await User.findById(user1._id);
    expect(user.email).toBe('newmail@mail.com')
})


test('Should not update invalid filed for user', async ()=> {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            location: '124'
        })
        .expect(400)
})