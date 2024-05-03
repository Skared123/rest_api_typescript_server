import { Router } from "express";
import { body, param } from "express-validator";
import {
  createProduct,
  deleteProductByID,
  getProductByID,
  getProducts,
  updateAvailability,
  updateProductByID,
} from "./handlers/product";
import { handleInputErrors } from "./middleware";

const router = Router();
/**
 *@swagger
 *components:
 *    schemas:
 *      Product:
 *         type: object
 *         properties:
 *          id:
 *            type: integer
 *            description: The Product ID
 *            example: 1
 *          name:
 *            type: string
 *            description: The Product name
 *            example: Monitor Curvo de 49 pulgadas
 *          price:
 *            type: number
 *            description: The Product price
 *            example: 300
 *          availability:
 *            type: boolean
 *            description: The Product availability
 *            example: true
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get a list of products
 *     tags:
 *       - Products
 *     description: Return a list of products
 *     responses:
 *       200:
 *         description: Succesful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */

/**
 *  @swagger
 *  /api/products/{id}:
 *   get:
 *     summary: Get a product by Id
 *     tags:
 *       - Products
 *     description: Return a product based on its unique ID
 *     parameters:
 *     - in: path
 *       name: id
 *       description: The ID of the product to retrieve
 *       required: true
 *       schema:
 *         type: integer
 *     responses:
 *       200:
 *         description: Succesful Response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Not Found
 *       400:
 *         description: Bad Request - Invalid ID
 */

/**
 * @swagger
 *  /api/products:
 *    post:
 *      summary: Creates a new product
 *      tags:
 *        - Products
 *      description: Returns a new record in the database
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: "Monitor Curvo 49 pulgadas"
 *                price:
 *                  type: number
 *                  example: 3.99
 *      responses:
 *        201: 
 *          description: Succesful response
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 *        400:
 *          description: Bad request - invalid input data
 */

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *    summary: Updated a product with user input
 *    tags:
 *      - Products
 *    description: Returns the updated product
 *    parameters:
 *     - in: path
 *       name: id
 *       description: The ID of the product to retrieve
 *       required: true
 *       schema:
 *         type: integer
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: "Monitor Curvo 49 pulgadas"
 *              price:
 *                type: number
 *                example: 3.99
 *              availability:
 *                type: boolean
 *                example: true
 *    responses:
 *      200: 
 *        description: Succesful response
 *        content: 
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      400:
 *        description: Bad Request - Invalid ID or Invalid input data
 *      404:
 *        description: Product not found
 */

/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *    summary: Update Product availability
 *    tags:
 *      - Products
 *    description: Returns the updated availability
 *    parameters:
 *     - in: path
 *       name: id
 *       description: The ID of the product to retrieve
 *       required: true
 *       schema:
 *         type: integer
 *    responses:
 *      200: 
 *        description: Succesful response
 *        content: 
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      400:
 *        description: Bad Request - Invalid ID 
 *      404:
 *        description: Product not found
 */

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *    summary: Delete a Product by ID
 *    tags:
 *      - Products
 *    description: Returns a confirmation message
 *    parameters:
 *     - in: path
 *       name: id
 *       description: The ID of the product to delete
 *       required: true
 *       schema:
 *         type: integer
 *    responses:
 *      200: 
 *        description: Succesful response
 *        content: 
 *          application/json:
 *            schema:
 *              type: string
 *              value: 'Producto Eliminado'
 *      400:
 *        description: Bad Request - Invalid ID 
 *      404:
 *        description: Product not found
 */

router.get("/", getProducts);

//Los : significaran un parametro que le pasare que en este caso es el ID
router.get(
  "/:id",
  param("id").isInt().withMessage("ID no valido"),
  handleInputErrors,
  getProductByID
);

router.post(
  "/",
  //Validacion
  body("name")
    .notEmpty()
    .withMessage("El nombre de producto no puede ir vacio"),
  body("price")
    .isNumeric()
    .withMessage("Valor no valido")
    .notEmpty()
    .withMessage("El precio del producto no puede ir vacio")
    .custom((value) => value > 0)
    .withMessage("Precio no valido"),
  //Custommiddleware
  handleInputErrors,
  createProduct
);

router.put(
  "/:id",
  param("id").isInt().withMessage("ID no valido"),
  body("name")
    .notEmpty()
    .withMessage("El nombre de producto no puede ir vacio"),
  body("price")
    .isNumeric()
    .withMessage("Valor no valido")
    .notEmpty()
    .withMessage("El precio del producto no puede ir vacio")
    .custom((value) => value > 0)
    .withMessage("Precio no valido"),
  body("availability").isBoolean().withMessage("Disponibilidad no valido"),
  handleInputErrors,
  updateProductByID
);

router.patch(
  "/:id",
  param("id").isInt().withMessage("ID no valido"),
  handleInputErrors,
  updateAvailability
);

router.delete(
  "/:id",
  param("id").isInt().withMessage("ID no valido"),
  handleInputErrors,
  deleteProductByID
);

export default router;
