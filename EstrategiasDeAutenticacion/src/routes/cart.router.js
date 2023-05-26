//Endpoints para manejar los carritos

const { Router } = require('express')
const CartManager = require('./../daos/mongo/cart.mongo.js')    //Importamos el cartManager

const cartManager = new CartManager()

const router = Router();    //Intanciamos router

//Endpoints para manejar los carritos

//Crear un carrito nuevo vacío
router.post('/', async (req, res)=>{
    try{
        const newCart = await cartManager.createCart()
        res.status(200).send({
            status: "success, se ha creado un nuevo carrito",
            payload: newCart
        })

    }catch(error){
        console.log(error)
    }

})

//Agrega un producto a un carrito
router.post('/:cid/product/:pid', async (req, res)=>{
    try{
        const {cid} = req.params
        const {pid} = req.params

        console.log(cid)
       
        const showCart = await cartManager.addProductToCart(cid, pid)
        res.status(200).send({
            status: `success, se añadió el producto al carro: ${cid}`,
            payload: showCart
        })

    }catch(error){
        console.log(error)
    }

})


//lista los productos en un carrito por el id del carrito
//Se añade population
router.get('/:cid', async (req, res)=>{
    try{
        const {cid} = req.params
        console.log(cid)
        const showCart = await cartManager.showCartProducts(cid)
        res.status(200).send({
            status: `success, se muestra el carrito: ${cid}`,
            payload: showCart
        })

    }catch(error){
        console.log(error)
    }
})

//Deberá eliminar del carrito el producto seleccionado
router.delete('/:cid/products/:pid', async (req, res)=>{
    try{
        const {cid} = req.params
        const {pid} = req.params
       
        const showCart = await cartManager.deleteProductFromCart(cid, pid)
        res.status(200).send({
            status: `success`,
            payload: showCart
        })

       

    }catch(error){
        console.log(error)
    }
})



//Deberá actualizar el carrito con un arreglo de productos
router.put('/:cid', async (req, res)=>{
    try{
        const {cid} = req.params
        const productArray = req.body

        const showCart = await cartManager.addProductArrayToCart(cid, productArray)
        res.status(200).send({
            status: `success`,
            payload: showCart
        })


    }catch(error){
        console.log(error)
    }
})

//Deberá poder actualizar solo la cantidad de ejemplares del producto por cualquier cantidad pasada por req.body
router.put('/:cid/products/:pid', async (req, res)=>{
    try{
        const {cid} = req.params
        const {pid} = req.params
        const {productQuantity} = req.body

        if (productQuantity < 0)  {  res.send({Error: `No se admite la cantidad ${productQuantity}`})
    } else{

        const showCart = await cartManager.updateProductQuantity(cid, pid, productQuantity)       
        res.status(200).send({
            status: `success, se actualizó la cantidad del producto ${pid} a ${productQuantity} unidades`,
            payload: showCart
        })
    }
    }catch(error){
        console.log(error)
    }
})

//Deberá eliminar todos los productos del carrito
router.delete('/:cid', async (req, res)=>{
    try{
        const {cid} = req.params
        const showCart = await cartManager.deleteAllProductsFromCart(cid)       
        res.status(200).send({
            status: `success, se han eliminado los productos del carro: ${cid}`,
            payload: showCart
        })

    }catch(error){
        console.log(error)
    }
})

module.exports = router