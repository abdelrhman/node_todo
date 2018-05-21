const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect(
  'mongodb://localhost:27017/TodoApp',
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      console.log('unable to connect to mongodb', error);
      return;
    }

    console.log('connected to mongodb');

    const db = client.db('TodoApp');
    //
    // db
    //   .collection('Todos')
    //   .find({ _id: new ObjectID('5b02b2231808a026e34e5c8b') })
    //   .toArray()
    //   .then(
    //     docs => {
    //       console.log(docs);
    //     },
    //     err => {
    //       console.log('Error', err);
    //     }
    //   );

    db
      .collection('Todos')
      .find()
      .count()
      .then(
        count => {
          console.log(count);
        },
        err => {
          console.log('Error', err);
        }
      );

    client.close();
  }
);
