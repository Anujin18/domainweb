const express = require('express')
const router = express.Router()
const Order = require('../models/order')
const mw = require('../middlewares/middleware')

//get all
router.get('/', mw.authenticateToken, async (req, res) => {
    try {
    const orders = await Order.find({ email: req.user.email })
        res.json(orders)
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

//get one
router.get('/:id', getOrder, (req, res) => {
    res.send(res.order.name)
})

router.get('/domain/:domain', async (req, res) => {
    try {
        const { domain } = req.params
        if(!domain) return res.status(404)
        const order = await Order.findOne({ name: domain })
        if(!order) return res.status(404).json({ error: 'not found' })
        res.status(200).json(order)
    } catch(error) {
        res.status(500)
    }
})

//create one
router.post('/', mw.authenticateToken, async (req, res) => {
    const order = new Order({
        name: req.body.name,
        createdAt: new Date(),
        email: req.user.email,
    })
    try {
        const newOrder = await order.save()
        
        res.status(201).json(newOrder)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

//update one
router.patch('/:id', getOrder, async (req, res) => {
    if (req.body.name != null) {
        res.order.name = req.body.name
    }
    if (req.body.customer != null) {
        res.order.customer = req.body.customer
    }
    if (req.body.email != null) {
        res.order.email = req.body.email
    }
    try {
        const updatedOrder = await res.order.save()
        res.json(updatedOrder)
    } catch (err) {
        res.status(400).json({ message : err.message })
    }
})

//delete one
router.delete('/:id', getOrder, async (req, res) => {
    try {
        await res.order.deleteOne()
        res.json({ message: 'Deleted Order' })
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

async function getOrder(req, res, next) {
    let order
    try {
        order = await Order.findById(req.params.id)
        if (order == null) {
            return res.status(404).json({ message: 'Cannot find order' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.order = order
    next()
}

module.exports = router