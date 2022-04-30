const request = require('supertest');
const app = require('../src/app')
const User = require('../src/models/user')
const Task = require('../src/models/task')
const { user1, user1ID, user2, setupDB, task1 } = require('./fixtures/db')

beforeEach(setupDB)

test('Create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            description: 'test task'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.description).toBe('test task')
    expect(task.completed).toBe(false)
})

test('Get task for user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)

   const tasks = response.body;
   expect(tasks).not.toBeNull();
   expect(tasks.length).toEqual(2);
})

test('Unable to delete task for another user', async () => {
    const response = await request(app)
        .delete('/tasks/' + task1._id)
        .set('Authorization', `Bearer ${user2.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(task1._id);
    expect(task).not.toBeNull()
})