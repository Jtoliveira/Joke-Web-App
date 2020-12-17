const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

async function initializePassport(passport, getUserByEmail, getUserById){

    const authenticateUser = async (email, password, done) =>{

        const user = await getUserByEmail(email)

        if(user == null){
            return done(null, false, {message: 'No user with that email'}) //error (null), false -> we didn't find a user
        }

        try{

            if(await bcrypt.compare(password, user.password)){
                return done(null, user) //adds the user to the requests
            }else{
                return done(null, false, {message: 'Password incorrect'})
            }

        }catch (error){
            return done(error)
        }

    } 


    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser)) //we dont need the password option bc it defaults to 'password'

    passport.serializeUser((user,done) => done(null, user.id)) //saves the id into the session

    passport.deserializeUser((id,done) => {

        return done(null, getUserById(id))
    })
}

module.exports = initializePassport