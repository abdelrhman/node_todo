const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/Todo');
const { User } = require('./../models/User');
const { todos, populateTodos, users, populateUsers } = require('./seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', done => {
    var text = 'test todo text';
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
      .send()
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(1);
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
    console.log(todos[1]._id.toHexString());
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .send()
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[1].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', done => {
    const newID = new ObjectID();
    request(app)
      .get(`/todos/${newID}`)
      .set('x-auth', users[0].tokens[0].token)
      .send()
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo id is invalid', done => {
    request(app)
      .get(`/todos/invalidid`)
      .set('x-auth', users[0].tokens[0].token)
      .send()
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/id', () => {
  it('Should remove a todo by id', done => {
    request(app)
      .delete(`/todos/${todos[0]._id}`)
      .set('x-auth', users[0].tokens[0].token)
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
      .delete(`/todos/${newID}`)
      .set('x-auth', users[0].tokens[0].token)
      .send()
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo id is invalid', done => {
    request(app)
      .delete(`/todos/invalidid`)
      .set('x-auth', users[0].tokens[0].token)
      .send()
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/id', () => {
  it('Should update todo', done => {
    request(app)
      .patch(`/todos/${todos[0]._id}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({ completed: true })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeTruthy();
      })
      .end(done);
  });

  it('Should clear completedAt', done => {
    request(app)
      .patch(`/todos/${todos[0]._id}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({ completed: false })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeNull();
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return a user if authenticated', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return a 401 if not authenticated', done => {
    request(app)
      .get('/users/me')
      .expect(401)
      .end(done);
  });
});

describe('POST /users', () => {
  var email = 'a@b.com';
  var password = '123123';
  it('should create user', done => {
    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body.user.id).toBeTruthy();
        expect(res.body.user.email).toBe(email);
      })
      .end(done);
  });

  it('should return validation error if request invalid', done => {
    request(app)
      .post('/users')
      .expect(400)
      .end(done);
  });

  it('should not  create user if email is already used ', done => {
    request(app)
      .post('/users')
      .send({ email: users[0].email, password })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('Log in user and return auth token', done => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens[1].token).toEqual(res.headers['x-auth']);
            return done();
          })
          .catch(err => done(err));
      });
  });

  it('Should reject invalid login', done => {
    request(app)
      .post('/users/login')
      .send({
        email: users[0].email,
        password: 'invalidPass'
      })
      .expect(400)
      .expect(res => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[0]._id)
          .then(user => {
            expect(user.tokens[1]).toBeFalsy();
            return done();
          })
          .catch(err => done(err));
      });
  });

  describe('/users/me/token', () => {
    it('should delete user token', done => {
      request(app)
        .delete('/users/me/token')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          User.findById(users[0]._id)
            .then(user => {
              expect(user.tokens.length).toBe(0);
              return done();
            })
            .catch(e => done(e));
        });
    });
  });
});
