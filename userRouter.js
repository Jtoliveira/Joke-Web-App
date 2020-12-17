const express = require('express')
const API = require('./APIrequests')
const User = require('./models/User')

const router = express.Router()

router.post('/delete/:jokeId/:userID', async (req,res) =>{

    let user = await User.findById(req.params.userID)

    joke = user.jokes.find(joke => joke.id === req.params.jokeId)

    user.jokes.splice(user.jokes.indexOf(joke), 1)

    user = await user.save()

    res.redirect('/')
})

router.post('/save/:jokeId/:userID', async (req,res) =>{

    try{
        let user = await User.findById(req.params.userID)

        API.request("https://sv443.net/jokeapi/v2/joke/Any?idRange=" + req.params.jokeId)
        .then(async data =>{

            if(data.type == "twopart"){

                user.jokes.push({
                    category: data.category,
                    type: data.type,
                    setup: data.setup,
                    delivery: data.delivery,
                    id: data.id
                })

            }else{
                user.jokes.push({
                    category: data.category,
                    type: data.type,
                    joke: data.joke,
                    id: data.id
                })
            }

            user = await user.save() //could use find and update instead
        
        })
        .catch(error => console.log(error.message)) 

    }catch (error){
        console.log(error)
    }

    res.redirect('/')
})

module.exports = router