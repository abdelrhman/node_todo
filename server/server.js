var express = require('express');
var bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { User } = require('./models/User');
var { Todo } = require('./models/Todo');

var app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  console.log(req.body);
  var todo = new Todo({
    text: req.body.text,
    completed: req.body.completed,
    completedAt: req.body.completedAt
  });

  todo.save().then(
    doc => {
      console.log(doc);
      res.status(400).send(doc);
    },
    e => {
      console.log(e);
      res.send(e);
    }
  );
});

app.listen(3000, () => {
  console.log('Started on 3000');
});
