const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const bcrypt = require('bcryptjs');

require('./config/config');
const { mongoose } = require('./db/mongoose');
const { User } = require('./models/User');
const { Todo } = require('./models/Todo');
const { authenticate } = require('./middlewear/authenticate');

const PORT = process.env.PORT;

var app = express();
app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    completed: req.body.completed,
    completedAt: req.body.completedAt,
    _creator: req.user._id
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

app.get('/todos', authenticate, (req, res) => {
  Todo.find({ _creator: req.user._id }).then(
    todos => {
      res.send({ todos });
    },
    err => {
      res.status(400).send(err);
    }
  );
});

app.get('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
    return;
  }

  Todo.findOne({ _id: id, _creator: req.user._id })
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

app.delete('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
    return;
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  })
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

app.patch('/todos/:id', authenticate, (req, res) => {
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

  Todo.findOneAndUpdate(
    { _id: id, _creator: req.user._id },
    { $set: body },
    { new: true }
  )
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

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  var user = new User({
    email: body.email,
    password: body.password
  });

  user
    .save()
    .then(() => {
      return user.genrateAuthToken();
    })
    .then(token => {
      res.header('x-auth', token).send({ user });
    })
    .catch(err => {
      res.status(400).send();
    });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  console.log(body);

  User.findByCredentials(body.email, body.password)
    .then(user => {
      return user
        .genrateAuthToken()
        .then(token => {
          res
            .header('x-auth', token)
            .status(200)
            .send({ user });
        })
        .catch(err => console.log(err));
    })
    .catch(err => {
      console.log(err);
      res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user
    .removeToken(req.token)
    .then(() => {
      res.status(200).send();
    })
    .catch(err => {
      res.status(400).send();
    });
});

app.listen(PORT, () => {
  console.log(`Started on ${PORT}`);
});

module.exports = { app };
