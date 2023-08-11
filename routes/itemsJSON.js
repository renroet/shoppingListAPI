
// app.js could require this file instead of items for a more ROM like storage of data
// would need slightly different testing to be written

const express = require('express');
const router = new express.Router();
const ExpressError = require('../expressError');
const fs = require('fs')
const db = "DB.json"


function getDB(db, callback) {
    fs.readFile(db, 'utf8', function cb(err, data) {
        if (err) {
            
            const err =  new ExpressError(`Error reading file ${db}`, 400)
            callback(err, null)
            
        }
        else {
            const json = JSON.parse(data)
            callback(null, json)
        }
    })
}

router.get("/", (req, res, next) => {

        getDB(db, (error, json) => {
            if(error) {
                next(error);
            }
            else {
                res.json(json.items)
            }
        })
    
})

router.post("/", (req, res, next) => {
    getDB(db, (error, json) => {
        if(error) {
            next(error);
        }
      
        else {
    try {
        if(!req.body.name || !req.body.price) throw new ExpressError("Items must have both name and price", 400);
        let name = req.body.name
        let price = req.body.price
        const newItem = {name: name, price: price}
        console.log(newItem)
        json.items.push(newItem)
        console.log(json)
        fs.writeFile(db, JSON.stringify(json), 'utf8', function(err) {
            if(err) throw new ExpressError(`Error writing data to ${db}`, 400)
        }) 
        return res.status(201).json({ added: newItem })
    } catch(e) {
        return next(e);
    }
        }
    })
})


router.get("/:name", (req, res, next) => {
    
        let name = req.params.name
        getDB(db, (error, json) => {
            if(error) {
                next(error);
            }
          
            else {
                try {
                    let item = json.items.find((item) => item.name === name)
                    if(item === undefined) throw new ExpressError("Item not found", 404)
                    res.json(item)
                } catch (e) {
                    next(e);
                }
            }
        })
    
})

router.patch("/:name",(req, res, next) => {
    let name = req.params.name
        getDB(db, (error, json) => {
            if(error) {
                next(error);
            }
          
            else {
                try {
                    let item = json.items.find((item) => item.name === name);
                    console.log(item)
                    let price = item.price
                    item.name = req.body.name || name
                    item.price = req.body.price || price
                    console.log(item)
                    fs.writeFile(db, JSON.stringify(json), 'utf8', function(err) {
                        if(err) throw new ExpressError(`Error writing data to ${db}`, 400)
                        }) 
                    return res.status(201).json({ updated: {"name": item.name, "price": item.price}})
                    } catch(e) {
                        return next(e);
                    }
            }
    })
    
})


router.delete("/:name", (req, res) => {
    getDB(db, (error, json) => {
        if(error) {
            next(error);
        }
      
        else {
            try {
                let item = json.items.findIndex((item) => item.name === req.params.name);
                if (item === -1) throw new ExpressError("Item not found", 404);
                json.items.splice(item,1)
                fs.writeFile(db, JSON.stringify(json), 'utf8', function(err) {
                    if(err) throw new ExpressError(`Error writing data to ${db}`, 400)
                    }) 
                res.json({message: "Deleted"})
            } catch (e) {
                next(e);
            }
}})

})




module.exports = router;

