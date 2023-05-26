//Configuración de passport

require('dotenv').config()	//para usar variables de entorno, y es necesario crear un archivo .env
const userModel = require('../daos/model/user.model.js')
const passport = require('passport')
const GithubStrategy = require('passport-github2')

const initPassportGithub = () => {
	passport.use('github', new GithubStrategy({
	clientID: "Iv1.33e76f991d8e803f",
	clientSecret: "c1bddee937505d3855ad504be559b79393324e9b",
	callbackURL: "http://localhost:8080/api/session/githubcallback"
}, async (accessToken, refreshToken, profile, done) => {
console.log('profile:', profile)
try{
	let user = await userModel.findOne({email: profile._json.email})
	if(!user) {
	let newUser = {
	first_name: profile.username,
	last_name: profile.username,
	email: profile._json.email,
    date_of_birth: "1980",
	password: ''
	}
	let result = await userModel.create(newUser)
	return done(null, result)
}
	return done(null, user)	//Mandamos esto si el usuario ya existe
}catch(error){
	console.log(error)
}
} ))
	passport.serializeUser(async (user, done)=> {
        done(null, user._id)
})
	passport.deserializeUser(async (id, done)=> {
	let user = await userModel.findOne({_id:id})
	done(null, user)
})
}

module.exports = {
	initPassportGithub
}