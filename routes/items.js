const express = require('express');
const router = new express.Router();
const ExpressError = require('../expressError');
const items = require('../fakeDB');
console.log(items)


router.get("/", (req, res) => {
    res.json(items)
})

router.post("/", (req, res, next) => {
    try {
        if(!req.body.name || !req.body.price) throw new ExpressError("Items must have both name and price", 400);
        let name = req.body.name
        let price = req.body.price
        const newItem = {name: name, price: price}
        console.log(newItem)
        items.push(newItem)
        return res.json({ added: newItem })
    } catch(e) {
        return next(e);
    }
})

router.get("/:name", (req, res, next) => {
    try{
        let name = req.params.name
        let item = items.find((item) => item.name === name)
        if(item === undefined) throw new ExpressError("Item not found", 404)
        return res.json({item: item})
    } catch(e) {
        return next(e);
    }
})

router.patch("/:name",(req, res) => {
    let name = req.params.name
    let item = items.find((item) => item.name === name);
    let price = item.price
    item.name = req.body.name || name
    item.price = req.body.price || price
    res.json({updated: item })
})


router.delete("/:name", (req, res) => {
    let item = items.findIndex((item) => item.name === req.params.name);
    items.splice(item,1)
    res.json({message: "Deleted"})
})




module.exports = router;