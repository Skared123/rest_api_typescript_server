import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options : swaggerJSDoc.Options = {
    swaggerDefinition:{
        openapi:'3.0.2',
        tags:[
            {
                name: 'Products',
                description: 'API operations related to products'
            }
        ],
        info:{
            title: 'REST API Node.js / Express / TypeScript',
            version: '1.0.0',
            description: 'API Docs for Products'
        }
    },
    apis:['./src/router.ts']
}
const swaggerSpec = swaggerJSDoc(options)

const swaggerUiOptions : SwaggerUiOptions = {
    customCss: `
        .topbar-wrapper .link{
            content: url('https://static-cdn.jtvnw.net/jtv_user_pictures/35a14b1c-6ab5-4e8b-b4ff-2e2ac1c12eea-profile_image-70x70.png');
            height: 80px;
            width: 80px;
        }
    `,
    customSiteTitle: 'Documentacion REST API Express / Typescript'
}

export default swaggerSpec;
export {
    swaggerUiOptions
}