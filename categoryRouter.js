const express = require('express')
const API = require('./APIrequests')


const router = express.Router()

router.get('/:category/:userID', (req,res) =>{

    console.log(req.params.userID)

    API.request("https://sv443.net/jokeapi/v2/joke/" + req.params.category + "?amount=10")
    .then(data => {

        let obj = {
            jokes: data.jokes,
            user: req.params.userID
        }

        res.render('index', obj)
    })
    .catch(error => console.log(error.message))
})

module.exports = router