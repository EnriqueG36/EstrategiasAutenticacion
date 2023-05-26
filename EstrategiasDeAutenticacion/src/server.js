//Script principal del servidor
const express = require('express')
const handlebars = require('express-handlebars')                //Importamos el modulo handlebars
const {Server} = require('socket.io')                           //Importamos el modulo socket.io
const session = require('express-session')
const MongoStore = require('connect-mongo')                     //Importamos el modulo connect mongo para trabajar las sessiones con mongoAtlas

const routerServer = require('./routes/index.js')	                    //este está mas adelante
const objectConfig = require('./config/configServer.js')                //Importamos el objecto de configuración de mongoose a mongoAtlas
const { websocketFuncion } = require('./utils/socketLogic.js')

const passport = require('passport')
const { initPassportGithub } = require('./config/passport.config.js')
//const initPassportGithub = require('./config/passport.config.js')

const app = express()

//Configuración de handlebars:
app.engine('handlebars', handlebars.engine())                   //Definir nuestro motor de plantillas
app.set('views', __dirname+'/views')                            //Settea el directorio donde buscará las carpetas de plantillas
app.set('view engine', 'handlebars')                            //indicamos a express que motor de plantillas se va a usar
app.use(express.static(__dirname+'/public'))

const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+'/public'))
app.use(session({
	store: new MongoStore({		//Si da problemas consultar 00:39
		mongoUrl: "mongodb+srv://enrique:dbmongo@clustercoder.ijswitn.mongodb.net/ecommerce?retryWrites=true&w=majority",
		mongoOptions: {
		useNewUrlParser: true,
		useUnifiedTopology: true
		},
		ttl: 600000*5, 		//tiempo de vida de la session
		retries: 0,			//Reintentos para volver a conectar la session
	}),
   
	secret: 'secretCoder',
	resave: false,
	saveUninitialized: false
}))

objectConfig.connectDB()                                //Se ejecuta el metodo connectDB para ejecutar la conexion conmongo Atlas

//Passport
initPassportGithub()
passport.use(passport.initialize())
passport.use(passport.session())

app.use(routerServer)	                             //Esto es nuevo, es para quitar los routers de productos y carritos del archivo principal, se define en un archivo index dentro de /routes

const httpServer = app.listen(PORT, (err) => {
if(err) console.log('Error en el servidor', err)
console.log(`Escuchando en el puerto: ${PORT}`)
})

const socketServer = new Server(httpServer)

//Funcion que contiene los eventos emit y on de websockets
websocketFuncion(socketServer)