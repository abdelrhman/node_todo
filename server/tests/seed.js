const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

var { Todo } = require('./../models/Todo');
var { User } = require('./../models/User');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
  {
    _id: userOneId,
    email: 'podo@example.com',
    password: 'userOnePass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign(
          { id: userOneId.toHexString(), access: 'auth' },
          process.env.JWT_SECRET
        )
      }
    ]
  },
  {
    _id: userTwoId,
    email: 'podo@usertwo.com',
    password: 'userTwoPass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign(
          { id: userTwoId.toHexString(), access: 'auth' },
          process.env.JWT_SECRET
        )
      }
    ]
  }
];

const todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId
  }
];

const populateTodos = done => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos).then(() => {
      done();
    });
  });
};

const populateUsers = done => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all([userOne, userTwo]).then(() => {
      done();
    });
  });
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
};
