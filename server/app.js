const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const Question = require('./models/question');
const Response = require('./models/response')
const Address = require('./models/address');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // MongoDB session store

const multer = require('multer');
const upload = multer({dest: 'uploads/'})

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const sessionSecret = 'make a secret string';

//Set up mongoose connection
var dbURL = 'mongodb+srv://yoolbi:yoolbi716@cluster0.mcvce.mongodb.net/local_library?retryWrites=true&w=majority'; // insert your database URL here
mongoose.connect(dbURL, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Create Mongo DB Session Store
const store = MongoStore.create({
    mongoUrl: dbURL,
    secret: sessionSecret,
    touchAfter: 24 * 60 * 60
})

// Setup to use the express-session package
const sessionConfig = {
    store,
    name: 'session',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
        // later you would want to add: 'secure: true' once your website is hosted on HTTPS.
    }
}

app.use(session(sessionConfig));

// This is a function we can use to wrap our existing async route functions so they automatically catch errors
// and call the next() handler
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}

const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).send("Need to login");
    }
    next();
}

// This is middleware that will run before every request
app.use((req, res, next) => {
    console.log(req.method, req.path, req.session.userId);
    next();
});

app.post('/api/register', wrapAsync(async function (req, res) {
    const {password, email, name} = req.body;
    const user = new User({email, password, name})
    await user.save();
    req.session.userId = user._id;
    res.json(user);
}));

app.post('/api/login', wrapAsync(async function (req, res) {
    const {password, email} = req.body;
    const user = await User.findAndValidate(email, password);
    if (user) {
        req.session.userId = user._id;
    } else {
        res.sendStatus(401);
    }
    res.json(user);
}));

app.post('/api/logout', wrapAsync(async function (req, res) {
    req.session.userId = null;
    res.sendStatus(204);
}));

// upload.single('image') tells it we are only uploading 1 file, and the file was named "image" on the front end client.
app.post('/api/users/:id/file', upload.single('image'), wrapAsync(async function (req, res) {
    console.log("File uploaded of length: " + req.file.size);
    console.dir(req.file);
    res.json("File uploaded successfully");
}));

//User
app.use('/api/users/:id', (req, res, next) => {
    console.log("Request involving a specific user")
    next();
})

app.get('/api/users', wrapAsync(async function (req,res) {
    // let users;
    // if (req.query.questions && req.query.questions === 'yes') {
    //     let aggregatePipeline = [
    //         {
    //             '$lookup': {
    //                 'from': 'questions',
    //                 'localField': '_id',
    //                 'foreignField': 'user',
    //                 'as': 'questions'
    //             }
    //         }, {
    //             '$sort': {
    //                 'name': 1
    //             }
    //         }
    //     ]
    //     users = await User.aggregate(aggregatePipeline);
    // } else {
    //     // users = await User.findById(req.session.userId);
    //     users = await User.find().populate('address');
    // }
    const users = await User.findById(req.session.userId).populate('address').lean();
    console.log(users);
    res.json(users);
}));

app.get('/api/users/:id', wrapAsync(async function (req,res, next) {
    let id = req.params.id;
    if (mongoose.isValidObjectId(id)) {
        // const user = await User.findById(id);
        const user = await User.findById(id).populate('address').lean();
        console.log(user);
        if (user) {
            res.json(user);
            return;
        } else {
            throw new Error('User Not Found');
        }
    } else {
        throw new Error('Invalid User Id');
    }
}));

app.put('/api/users/:id', wrapAsync(async function (req, res) {
    const id = req.params.id;
    const {name, email, password, profile_url, address} = req.body;
    console.log("PUT with id: " + id + ", body: " + JSON.stringify(req.body));
    await User.findByIdAndUpdate(id, {name, email, password, profile_url, address},
        {runValidators: true});
    res.sendStatus(204);
}));

app.post('/api/users', wrapAsync(async function (req, res) {
    console.log("Posted with body: " + JSON.stringify(req.body));
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    await newUser.save();
    res.json(newUser);
}));

app.get('/api/currentUser', wrapAsync(async function (req, res) {
    // User.findById(req.session.userId).then(user =>{
    //     Address.findById(user.address).then(address => {console.log(address);res.json({...user._doc, street: address.street, state: address.state})});
    // });
    User.findById(req.session.userId).populate("address").then(user => res.json({...user._doc, street: user.address.street, state: user.address.state}));

    // res.json(user);
}));

//Questions
app.use('/api/questions', (req, res, next) => {
    console.log("Request involving a specific question")
    next();
})

app.get('/api/questions', requireLogin, wrapAsync(async function (req,res) {
    console.log("Accessed by user id: " + req.session.userId);
    const questions = await Question.find({questionOwner: req.session.userId});
    res.json(questions);
}));

app.get('/api/questions/:id', requireLogin, wrapAsync(async function (req,res, next) {
    let id = req.params.id;
    if (mongoose.isValidObjectId(id)) {
        const question = await Question.findById(id);
        if (question) {
            res.json(question);
            return;
        } else {
            // The thrown error will be handled by the error handling middleware
            throw new Error('Question Not Found');
        }
    } else {
        throw new Error('Invalid Question Id');
    }
}));

app.delete('/api/questions/:id', requireLogin, wrapAsync(async function (req, res) {
    const id = req.params.id;
    const result = await Question.findByIdAndDelete(id);
    console.log("Deleted successfully: " + result);
    res.json(result);
}));

app.put('/api/questions/:id', requireLogin, wrapAsync(async function (req, res) {
    const id = req.params.id;
    console.log("PUT with id: " + id + ", body: " + JSON.stringify(req.body));
    await Question.findByIdAndUpdate(id,
        {'questionText': req.body.questionText, 'responseType': req.body.responseType,
            'multiText': req.body.multiText, 'response': req.body.response},
        {runValidators: true});
    res.sendStatus(204);
}));

// The React app does not call the below methods, but these are further examples of using Express
app.post('/api/questions', requireLogin, wrapAsync(async function (req, res) {
    console.log("Posted with body: " + JSON.stringify(req.body));
    const newQuestion = new Question({
        questionText: req.body.questionText,
        responseType: req.body.responseType,
        questionOwner: req.session.userId,
        multiText: req.session.multiText,
        response: req.session.response
    })
    // Calling save is needed to save it to the database given we aren't using a special method like the update above
    await newQuestion.save();
    res.json(newQuestion);
}));

//Responses
app.use('/api/responses', (req, res, next) => {
    console.log("Request involving a specific response")
    next();
})

app.get('/api/responses', requireLogin, wrapAsync(async function (req,res) {
    console.log("Accessed by user id: " + req.session.userId);
    const responses = await Response.find({});
    res.json(responses);
}));

app.get('/api/responses/:id', requireLogin, wrapAsync(async function (req,res, next) {
    let id = req.params.id;
    if (mongoose.isValidObjectId(id)) {
        const response = await Response.findById(id);
        if (response) {
            res.json(response);
            return;
        } else {
            // The thrown error will be handled by the error handling middleware
            throw new Error('Response Not Found');
        }
    } else {
        throw new Error('Invalid Response Id');
    }
}));

// The React app does not call the below methods, but these are further examples of using Express
app.post('/api/responses', requireLogin, wrapAsync(async function (req, res) {
    console.log("Posted with body: " + JSON.stringify(req.body));
    const newResponse = new Response({
        responseText: req.body.responseText,
        date: req.body.date,
    })
    // Calling save is needed to save it to the database given we aren't using a special method like the update above
    await newResponse.save();
    res.json(newResponse);
}));

app.put('/api/responses/:id', requireLogin, wrapAsync(async function (req, res) {
    const id = req.params.id;
    console.log("PUT with id: " + id + ", body: " + JSON.stringify(req.body));
    await Response.findByIdAndUpdate(id,
        {'responseText': req.body.responseText, 'date': req.body.date},
        {runValidators: true});
    res.sendStatus(204);
}));

//Address
app.use('/api/addresses', (req, res, next) => {
    console.log("Request involving a specific address")
    next();
})

app.get('/api/addresses', requireLogin, wrapAsync(async function (req,res) {
    console.log("Accessed by user id: " + req.session.userId);
    const addresses = await Response.find({});
    res.json(addresses);
}));

app.get('/api/addresses/:id', requireLogin, wrapAsync(async function (req,res, next) {
    let id = req.params.id;
    if (mongoose.isValidObjectId(id)) {
        const address = await Address.findById(id);
        if (address) {
            res.json(address);
            return;
        } else {
            // The thrown error will be handled by the error handling middleware
            throw new Error('Response Not Found');
        }
    } else {
        throw new Error('Invalid Response Id');
    }
}));

// The React app does not call the below methods, but these are further examples of using Express
app.post('/api/addresses', requireLogin, wrapAsync(async function (req, res) {
    console.log("Posted with body: " + JSON.stringify(req.body));
    const newAddress = new Address({
        street: req.body.street,
        state: req.body.state,
    })
    // Calling save is needed to save it to the database given we aren't using a special method like the update above
    await newAddress.save();
    res.json(newAddress);
}));

app.put('/api/addresses/:id', requireLogin, wrapAsync(async function (req, res) {
    const id = req.params.id;
    console.log("PUT with id: " + id + ", body: " + JSON.stringify(req.body));
    await Address.findByIdAndUpdate(id,
        {'street': req.body.street, 'state': req.body.state},
        {runValidators: true});
    res.sendStatus(204);
}));

app.use((err, req, res, next) => {
    console.log("Error handling called");
    res.statusMessage = err.message;

    if (err.name === 'ValidationError') {
        res.status(400).end();
    }
    else {
        res.status(500).end();
    }
})

const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(`server started on ${port}!`)
});
