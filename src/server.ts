import express from 'express'
import router from './router'
import colors from 'colors'
import cors, { CorsOptions } from 'cors'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec, {swaggerUiOptions} from './config/swagger'
import db from './config/db'

//Instancia de express
const server = express()

//Permitir conexiones
const corsOptions : CorsOptions = {
    origin: function( origin, callback ) {
        if(origin === process.env.FRONTEND_URL){
            callback( null, true)
        }else{
            callback(new Error('Error de CORS'))
        }
    }
}
server.use(cors(corsOptions))

//Leer datos de formulario
server.use(express.json())

//Obtener informacion con morgan
server.use(morgan('dev'))

//Conectar a base de datos
export async function connectDB(){
    try {
        await db.authenticate()
        db.sync()
    } catch (error) {
        console.log(colors.bgRed.white('Hubo un error a la hora de conectar la DB'))
    }
}

connectDB()

server.use('/api/products', router)

//Documentacion
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))


export default server