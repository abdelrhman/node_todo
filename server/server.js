const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

require('./config/config');
const { mongoose } = require('./db/mongoose');
const { User } = require('./models/User');
const { Todo } = require('./models/Todo');

const PORT = process.env.PORT;

var app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    completed: req.body.completed,
    completedAt: req.body.completedAt
  });

  todo.save().then(
    doc => {
      res.send(doc);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.get('/todos', (req, res) => {
  Todo.find().then(
    todos => {
      res.send({ todos });
    },
    err => {
      res.status(400).send(err);
    }
  );
});

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
    return;
  }

  Todo.findById(id)
    .then(todo => {
      if (!todo) {
        res.status(404).send();
        return;
      }

      res.send({ todo });
    })
    .catch(err => {
      res.status(400).send();
    });
});

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
    return;
  }

  Todo.findByIdAndRemove(id)
    .then(todo => {
      if (!todo) {
        res.status(404).send();
        return;
      }
      res.send({ todo });
    })
    .catch(err => {
      res.status(400).send();
    });
});

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    res.status(404).send();
    return;
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then(todo => {
      if (!todo) {
        res.status(404).send();
        return;
      }
      res.send({ todo });
    })
    .catch(err => {
      res.status(400).send();
    });
});

app.listen(PORT, () => {
  console.log(`Started on ${PORT}`);
});

module.exports = { app };
