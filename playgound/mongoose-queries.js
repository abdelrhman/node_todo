const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/Todo');
const { User } = require('./../server/models/User');

const id = '5b042cc870f38e3f897446c4';

const email = 'a@b.com';

// if (!ObjectID.isValid(id)) {
//   console.log('id not valid');
// }

// Todo.find({
//   _id: id
// }).then(todos => {
//   console.log(todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then(todo => {
//   console.log(todo);
// });

// Todo.findById(id)
//   .then(todo => {
//     if (!todo) {
//       return console.log('No todo');
//     }
//     console.log(todo);
//   })
//   .catch(err => {
//     console.log(err);
//   });

User.findById(id)
  .then(user => {
    if (!user) {
      return console.log('No user');
    }
    console.log(user);
  })
  .catch(err => {
    console.log(err);
  });

User.findOne({
  email
})
  .then(user => {
    if (!user) {
      console.log('No user');
    }

    console.log(user);
  })
  .catch(err => {
    console.log(err);
  });
