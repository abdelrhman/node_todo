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

    // db.collection('Todos').insertOne(
    //   {
    //     text: 'Something to do ',
    //     completed: false
    //   },
    //   (err, result) => {
    //     if (err) {
    //       console.log('Faild to add data', err);
    //       return;
    //     }
    //     console.log(result.ops);
    //   }
    // );

    // db.collection('Users').insertOne(
    //   {
    //     name: 'Podo',
    //     age: 24,
    //     location: 'Cairo, Egypt'
    //   },
    //   (err, result) => {
    //     if (err) {
    //       console.log('Faild to add data', err);
    //       return;
    //     }
    //     console.log(result.ops);
    //   }
    // );

    client.close();
  }
);
