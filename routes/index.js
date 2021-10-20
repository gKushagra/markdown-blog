require('dotenv').config();
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var { nanoid } = require('nanoid');
var { MongoClient } = require('mongodb');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

const mongoUri = process.env.MONGO_URI;
const mongoClient = new MongoClient(mongoUri);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json("Kush's CS Blogs API.");
});

router.post('/authenticate', function (req, res, next) {
  console.log(req.body);
  if (process.env.ACCESS_CODE === req.body['X-ACCESS-CODE']) {
    res.status(200).json({
      token: jwt.sign({
        user: "kushagra_gupta"
      },
        process.env.TOKEN_SECRET)
    });
  } else {
    res.sendStatus(404);
  }
});

router.get('/blog', async function (req, res, next) {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("markdown_blog");
    const coll = db.collection("blogs");
    const options = {
      sort: { date: 1 },
      //projection: { id: 1, title: 1, date: 1 }
    };
    var cursor = coll.find({}, options);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  } finally {
    if ((await cursor.count()) === 0) {
      res.status(200).json([]);
    } else {
      let blogs = [];
      await cursor.forEach(doc => blogs.push(doc));
      await mongoClient.close();
      res.status(201).json(blogs);
    }
  }
});

router.get('/blog/:id', async function (req, res, next) {
  const id = req.params.id;
  try {
    await mongoClient.connect();
    const db = mongoClient.db("markdown_blog");
    const coll = db.collection("blogs");
    const query = { id };
    var result = await coll.findOne(query);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  } finally {
    await mongoClient.close();
    res.status(201).json(result);
  }
});

router.post('/blog', verifyToken, async function (req, res, next) {
  console.log(req.body);
  const doc = req.body;
  doc.id = nanoid();
  try {
    await mongoClient.connect();
    const db = mongoClient.db("markdown_blog");
    const coll = db.collection("blogs");
    const result = await coll.insertOne(doc);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  } finally {
    await mongoClient.close();
    res.status(201).json(doc);
  }
});

router.put('/blog/:id', verifyToken, async function (req, res, next) {
  console.log(req.body);
  const id = req.params.id;
  const updatedDoc = req.body;
  try {
    await mongoClient.connect();
    const db = mongoClient.db("markdown_blog");
    const coll = db.collection("blogs");
    const query = { id };
    const result = await coll.updateOne(query, updatedDoc);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  } finally {
    await mongoClient.close();
    res.status(201).json(updatedDoc);
  }
});

router.delete('/blog/:id', verifyToken, async function (req, res, next) {
  console.log(req.params.id);
  const id = req.params.id;
  try {
    await mongoClient.connect();
    const db = mongoClient.db("markdown_blog");
    const coll = db.collection("blogs");
    const query = { id };
    var result = await coll.deleteOne(query);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  } finally {
    await mongoClient.close();
    if (result.deletedCount === 1) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  }
});

router.post('/media', verifyToken, async function (req, res, next) {

  var form = formidable.IncomingForm()
  var uploadDir = path.join(__dirname + process.env.PUBLIC_MEDIA_DIR);
  console.log(uploadDir);

  form.multiples = false;
  form.maxFileSize = 100 * 1024 * 1024;
  form.uploadDir = uploadDir;

  form.parse(req, async (err, fields, files) => {
    // console.log(files);

    if (err) {
      console.log(err);
      res.sendStatus(500);
    }

    // rename file - save original filename
    fs.rename(files.uploadFile.path, form.uploadDir + files.uploadFile.name, (err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500)
      }
    });

    // save in database
    let doc = {
      id: nanoid(),
      name: files.uploadFile.name,
      type: files.uploadFile.type,
      size: files.uploadFile.size,
      path: form.uploadDir + files.uploadFile.name
    }

    try {
      await mongoClient.connect();
      const db = mongoClient.db("markdown_blog");
      const coll = db.collection("files");
      const result = await coll.insertOne(doc);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    } finally {
      await mongoClient.close();
      res.status(201).json(doc);
    }
  });

});

router.get('/media/:id', verifyToken, async function (req, res, next) {

});

router.delete('/media/:id', verifyToken, async function (req, res, next) {

});

function verifyToken(req, res, next) {
  if (jwt.verify(req.headers.authorization.split(" ")[1], process.env.TOKEN_SECRET)) {
    next();
  } else {
    res.sendStatus(404);
  }
}

module.exports = router;
