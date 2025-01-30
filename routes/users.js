const express = require('express')
const router = express.Router()
const user = require('../models/user')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
router.use(express.json())


const mw = require('../middlewares/middleware.js')

//get all
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

//create one
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/
        if(!passwordRegex.test(password)) {
            return res.status(400).json({ message: "ydaj 1,1 too tom vseg jijig vsegtei bn"})
        }
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        console.log(salt)
        console.log(hashedPassword)
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
        })
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//post
router.get('/posts', mw.authenticateToken, (req, res) => {
    res.json({ ok: 1 })
})

//get one
router.get('/:id', getUser, (req, res) => {
    res.json(res.user)
})

// Login
router.post('/login', async (req, res) => {
    const email = req.body.email
    const user = { email: email }

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        const user = await User.findOne({ email }); 
        if (!user) {
            return res.status(400).json({ message: 'User does not exist.' });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Incorrect password.' });
        }
        return res.status(200).json({ accessToken: accessToken });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

//sign up
router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;
        if (!firstName || !lastName || !email || !phone || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
        });
        await newUser.save();
        const accessToken = jwt.sign({ email: newUser.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        return res.status(201).json({
            message: 'User registered successfully.',
            accessToken,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});


//update one
router.patch('/:id', getUser, async (req, res) => {
    if (req.body.firstName != null) {
        res.user.firstName = req.body.firstName
    }
    if (req.body.lastName != null) {
        res.user.lastName = req.body.lastName
    }
    if (req.body.email != null) {
        res.user.email = req.body.email
    }
    if (req.body.phone != null) {
        res.body.phone = req.body.phone
    }
    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({ message : err.message })
    }
})

//delete one
router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.deleteOne()
        res.json({ message: 'Deleted User' })
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

async function getUser(req, res, next) {
    let user
    try {
        user  = await User.findById(req.params.id)
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.user = user
    next()
}


module.exports = router