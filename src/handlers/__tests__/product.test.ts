import request from 'supertest'
import server from '../../server'

describe('POST api/products', () => {
    test('Should display validation errors', async () => {
        const response = await request(server).post('/api/products').send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)

    })
    test('Should validate that the pice is greater than 0 ', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Mouse Gamer test con precio 0",
            price: 0
          })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)

    })
    test('It should validate that the price is a number and greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Mouse Gamer test con precio 0",
            price: "hola"
          })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(3)

    })
    test('Should create a new product', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Mouse-Testing",
            price: 50
          })

          //En vez del toBe() tambien puedo utilizar toEqual()
          expect(response.status).toBe(201)
          expect(response.body).toHaveProperty('data')

          //Validar que no sea un error
          expect(response.status).not.toBe(404)
          expect(response.status).not.toBe(200)
          expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET api/products', () => {
    test('It should check if api/products url exists', async  () => {
        const response = await request(server).get('/api/products')
        expect(response.status).not.toBe(404)
    })
    test('GET a JSON response with products', async () => {
        const response = await request(server).get('/api/products')
        
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)

        expect(response.body).not.toHaveProperty('errors')
        expect(response.status).not.toBe(404)

    })
})

describe(' GET api/products/:id', () => {
    test('Should return a 404 response for non-existent product', async() => {
        const productId = 2000
        const response = await request(server).get(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe("Producto no encontrado")
    })
    test('Should check a valid ID in the URL', async () => {
        const response = await request(server).get(`/api/products/not-valid-url`)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("ID no valido")
    })
    test('get a JSON response for a single product', async () => {
        const response = await request(server).get(`/api/products/1`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })
})

describe('PUT api/products/:id', () => {
    test('Should check a valid ID in the URL', async () => {
        const response = await request(server).put(`/api/products/not-valid-url`).send({
            name : "Monitor Curvo",
            availability: true,
            price: 300
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("ID no valido")
    })
    test('Should display validation error messages when updating a product', async () => {
        const response = await request(server).put('/api/products/1').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })
    test('Should valdiate that the price is greater than 0', async () => {
        const response = await request(server).put('/api/products/1').send({
            name : "Monitor Curvo",
            availability: true,
            price: 0
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
        expect(response.body.errors[0].msg).toBe("Precio no valido")
    })
    test('Should return a 404 response for a non existent product', async () => {
        const productId = 2000
        const response = await request(server).put(`/api/products/${productId}`).send({
            name : "Monitor Curvo",
            availability: true,
            price: 300
        })

        expect(response.status).toBe(404)
        expect(response.body.error).toBe("Producto no encontrado")

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })
    test('Should update an existing product with a valid data', async () => {
        const response = await request(server).put(`/api/products/1`).send({
            name : "Monitor Curvo",
            availability: true,
            price: 300
        })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })

})

describe('PATCH api/products/:id', () => {
    test('Should return a 404 response for a non-existing product', async () => {
        const productId = 2000
        const response = await request(server).patch(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe("Producto no encontrado")
        
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty("data")
    })
    test('Should update the product availability', async () => {
        const response = await request(server).patch(`/api/products/1`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
        expect(response.body.data.availability).toBe(false)

        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty("error")
    })
})

describe('DELETE api/products/:id', () => {
    test('should check a valid ID', async () => {
        const response = await request(server).delete('/api/products/not-valid-url')
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors[0].msg).toBe("ID no valido")
    })
    test('Should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const response = await request(server).delete(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe("Producto no encontrado")

        expect(response.status).not.toBe(200)
    })

    test('It should delete a product', async () => {
        const response = await request(server).delete('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body.data).toBe("Producto Eliminado")

        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
    })
})

