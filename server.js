if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
} //used in development but abandoned upon release to public repo, replaced the .env file with the secret for "keyboard cat"

const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const initializePassport = require('./passportConfig')
const methodOverride = require('method-override')
const User = require('./models/User')
const mongoose = require('mongoose')
const categoryRouter = require('./categoryRouter')
const userRouter = require('./userRouter')

//connects to the database with the name 'users'
mongoose
.connect('mongodb://localhost/users', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then(()=> console.log("Database Connected"))
.catch(err => console.log(err))

initializePassport(
    passport, 
    email => User.findOne({email: email}),
    id => User.findOne({id: id})
)

const app = express()

app.set('view engine','ejs')

app.use('/cat', categoryRouter)
app.use('/user', userRouter)

app.use(express.urlencoded({extended:false}))//access the form items in the req body
app.use(flash())
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, async (req,res) =>{ //homepage, my jokes

    let user = await User.findById(req.session.passport.user)

    res.render('myJokes', {jokes: user.jokes, user: req.session.passport.user})
})

app.get('/login', checkNotAuthenticated,(req,res) =>{
    res.render('login')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req,res) =>{
    res.render('register')
})

app.post('/register',checkNotAuthenticated,  async (req,res) =>{

   try{
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    let user = new User()

    user.username = req.body.name
    user.password = hashedPassword
    user.email = req.body.email

    user = await user.save() //save the user to the database

    res.redirect('/login')

   }catch (error){
       console.log(error)
        res.redirect('/register')
   }
})

app.delete('/logout', (req,res)=>{
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req,res,next){

    if(req.isAuthenticated()){
        return next()
    }else{
        res.redirect('/login')
    }

}

function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }else{
        next()
    }
}

app.listen(3000)