//Configuracion para la conexion de nuestra base de datos en mongoAtlas

const {connect} = require('mongoose')

const url = "mongodb+srv://enrique:dbmongo@clustercoder.ijswitn.mongodb.net/ecommerce?retryWrites=true&w=majority"        //Aquí pegamos la connection string que inclye nuestro user y password de nuestro cluster en mongoAtlas, 
                                                                                                                    //Antes del ? colocamos el nombre de nuestra base de datos

module.exports = {
    connectDB: () => { 
        connect(url) 
        console.log('Base de datos conectada') 
    }}