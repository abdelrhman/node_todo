const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

var { app } = require('./../server');
var { Todo } = require('./../models/Todo');

const todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo'
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo'
  }
];

beforeEach(done => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos).then(() => {
      done();
    });
  });
});

describe('POST /todos', () => {
  it('should create a new todo', done => {
    var text = 'test todo text';
    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });

  it('should not create todo', done => {
    request(app)
      .post('/todos')
      .send()
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', done => {
    request(app)
      .get('/todos')
      .send()
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        done();
      });
  });
});

describe('GET /todos/id', () => {
  it('shoud get a todo', done => {
    request(app)
      .get(`/todos/${todos[0]._id}`)
      .send()
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', done => {
    const newID = new ObjectID();
    request(app)
      .get(`/todos/${newID}`)
      .send()
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo id is invalid', done => {
    request(app)
      .get(`/todos/invalidid`)
      .send()
      .expect(404)
      .end(done);
  });
});
