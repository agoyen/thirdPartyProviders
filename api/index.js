const express = require('express')
const app = express()

const MercadoPago = require('../lib/mercadopago')


app.post('/token', async(req, res)=>{
	console.log(req.body)
	const userId = req.body.userId
	const token= req.body.cardToken.id
	console.log(userId, token)

	// traer el usuario de la api de loyalty con el token (data.userId)
	// devuelve JSON {discount, email, }
	// TODO

	// asocia a mercadopago el user con el email de respuesta
	const data = await MercadoPago.createCustomer(userId)
	const {response, status} = data
	console.log(response)

	//Realizar pago con 0 amount

	// asocia tarjeta usuario
	//const addCardResponse = await MercadoPago.addCardCustomer(response.id, token)
	//console.log(addCardResponse)

	res.status(201).send({status:201, message:"New user created"})
})

app.get('/discount', (req, res)=>{
	res.status(200).send({code: 'claro_20'})
})

app.get('/ping', (req, res)=>{
	console.log(req.headers)
	res.status(200).send('pong')
})

module.exports = { path: '/api', handler: app }
