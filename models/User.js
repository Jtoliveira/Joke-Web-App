const mongoose = require('mongoose')
const slugify = require('slugify')

const subSchema = new mongoose.Schema({
    category:{
        type: String,
        required:true
    },
    type:{
        type: String,
        required:true
    },
    joke:{
        type:String
    },
    setup:{
        type:String
    },
    delivery:{
        type: String
    },
    id:{
        type: String
    }
})

//creates a schema
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String
    },
    email:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now //() => Date.now()
    },
    slug:{ //it's worth storing in the database bc that way it's calculated once and not needed to recalculate everytime you need it
        type: String,
        required: true,
        unique: true //so two users arren't allowed to have the same name, it would mess with the routes
    },
    jokes:[subSchema]
})

//the function in the parameter is run on the action (validation is done before every action [save,delete,update, etc]); "this" is the article being managed
userSchema.pre('validate', function(next) {
    if(this.username){
        this.slug = slugify(this.username, {lower: true, strict: true}) //lower: no caps, strict: no url unfriendly chars, 
    }
    next()
})

//creates a table in the database called "Article" according to the schema 
module.exports = mongoose.model('User', userSchema)