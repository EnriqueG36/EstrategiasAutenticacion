//Router de sesiones

const { Router } = require('express')
const router = Router()
const userModel = require('../daos/model/user.model')
const { createHash, isValidPassword } = require('../utils/utils')
const passport = require('passport')

/*
//Login
router.post('/login', async (req, res)=>{
		try{
            const {email, password} = req.body              //Obtenemos el email y el password del req.body

            console.log(req.body)
            //Validacion del admin, este admin no se guardará en la base de datos users
            if(email == "adminCoder@coder.com" && password == "adminCod3r123") {
                req.session.user = {
                    first_name: "Nombre Admin coder",
                    last_name: "Apellido Admin coder",
                    email: email,
                    role: "admin"
                }

                res.redirect('/products')

            }else{
            
           // const userDB = await userModel.findOne({email, password})   //Buscamos en la base de datos si se encuentran el email y el password
            
           // if(!userDB) return res.send({status: "Error", message: "No existe el usuario"})

           //Nuevas funciones con password hasheado
           console.log(email, password)
           const userDB = await userModel.findOne({email})
           console.log(userDB)
           if (!userDB) return res.status(400).send({status: "error", error: "Email not found"})
           if(!isValidPassword(userDB, password)) return res.status(403).send({status: "error", error: "Incorrect password"})       //Compara el password ingresado con el password en la DB

            //Guardamos en la seesion los datos de firts_name, last_name, email
            req.session.user = {
                first_name: userDB.first_name,
                last_name: userDB.last_name,
                email: userDB.email,
                role: "user"
            }

            //res.send({status: "Success", message: "Session iniciada con exito"})
            res.redirect('/products')                                   //Redirige a la vista products
        }
        }catch(error){
            console.log(error)
        }


})
*/

//Nuevo endpoint de login con github
//github, la primera redirecciona a la segunda
router.get('/github', passport.authenticate('github', {scope: ['user:email']}))

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/views/login'}), async (req, res)=>{
	req.session.user = req.user
	res.redirect('/products')               //Vista de productos
})


//Regitro de usuario, los datos de usuarios se guardaran en mongoAtlas
router.post('/register', async (req, res) => {
    const {first_name, last_name, email, date_of_birth, password} = req.body       //Obtenemos estos atributos del req.body
    
    //Validar si los campos introducidos no están vacíos
    if(!first_name || !last_name || !email || !date_of_birth || !password) return res.send({message: "Todos los campos son obligatorios"})
    
    //Validar si el campo email está repetido
    const existEmail = await userModel.findOne({email})                             //Buscamos en la base de datos si el email ya existe 

    if (existEmail) return res.send({status: "Error", error: "email ya registrado"})    //Si existe respondemos con este mensaje

    //Definimos un nuevo objeto con los datos de nuevo usuario
    const newUser = {
        first_name,
        last_name,
        email,
        date_of_birth,
        password: createHash(password)                            //Pendiente de encriptar
    }

    let resultUser = await userModel.create(newUser)                                //Creamos un nuevo usuario en la base de datos

    res.status(200).send({message: 'registro exitoso'})
})

//logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            return res.send({status: 'error', error: err})
        }
    })

    res.redirect('/login')  

})

module.exports = router

