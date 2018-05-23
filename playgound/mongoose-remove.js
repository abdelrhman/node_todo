const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/Todo');
const { User } = require('./../server/models/User');

const id = '5b042cc870f38e3f897446c4';

const email = 'a@b.com';

Todo.remove({}).then(result => {
  console.log(result);
});

//Todo.findOneAndRemove()
//Todo.findByIdAndRemove()
