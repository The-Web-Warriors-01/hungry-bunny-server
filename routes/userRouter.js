const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const { ObjectId } = require('mongodb');


router.post('/', async (req, res) => {
    const data = req.body;
    const email = data.email;
    const regex = new RegExp(email, 'i'); // i for case insensitive
    const result1 = await req.mongo.usersCollection.findOne({ email: regex });
    if (result1) {
        res.send({ message: 'User already exists' });
        return;
    }
    const result = await req.mongo.usersCollection.insertOne(data);
    res.send(result);
});


router.get('/', async (req, res) => {
    const result = await req.mongo.usersCollection.find().toArray()
    res.send(result)
})



// Update User Roles

router.patch('/admin/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }
    const updateDoc = {
        $set: {
            role: 'admin'
        },
    };
    const result = await req.mongo.usersCollection.updateOne(filter, updateDoc)
    res.send(result)
})

router.patch('/restaurant/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }
    const updateDoc = {
        $set: {
            role: 'restaurant'
        },
    };
    const result = await req.mongo.usersCollection.updateOne(filter, updateDoc)
    res.send(result)
})




router.get('/:email', verifyJWT, async (req, res) => {
    const email = req.params.email;
    const regex = new RegExp(email, 'i'); // i for case insensitive
    const result = await req.mongo.usersCollection.findOne({ email: regex });
    res.send(result);
});

// Update user.photo
router.put('/photo/:email', verifyJWT, async (req, res) => {
    const email = req.params.email;
    const photo = req.body.photo;
    const options = { upsert: true };
    const regex = new RegExp(email, 'i'); // i for case insensitive
    const filter = { email: regex };
    const updatedDocx = {
        $set: {
            photo: photo
        },
    }
    const result = await req.mongo.usersCollection.updateOne(filter, updatedDocx, options);
    res.send(result);
});


router.put('/address/:email', async (req, res) => {
    const email = req.params.email;
    const address = req.body.address;
    // console.log(address);
    const options = { upsert: true };
    const regex = new RegExp(email, 'i'); // i for case insensitive
    const filter = { email: regex };
    const updatedDocx = {
        $set: {
            location: address
        },
    }
    const result = await req.mongo.usersCollection.updateOne(filter, updatedDocx, options);
    res.send(result);
})



router.get('/post/:email', verifyJWT, async (req, res) => {
    const email = req.params.email;
    const result = await req.mongo.usersCollection.findOne({ email: email }, { projection: { post: 1, _id: 0 } });
    res.send(result.post);
});


// Get user email , 
router.get('/email/:email', async (req, res) => {
    const email = req.params.email;
    const regex = new RegExp(email, 'i'); // i for case insensitive
    const result = await req.mongo.usersCollection.findOne({ email: regex }, { projection: { email: 1, _id: 0 } });
    res.send(result);
});

module.exports = router;