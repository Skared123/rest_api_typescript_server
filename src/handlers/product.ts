import { Request, Response } from "express";
import Product from "../models/Product.model";

export const getProducts = async (req: Request, res: Response) => {
  const products = await Product.findAll({
    order: [["id", "ASC"]]
  });
  res.json({ data: products });
};

export const getProductByID = async (req: Request, res: Response) => {
  const { id } = req.params;
    const data = await Product.findByPk(id);
    if (!data) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }
    res.json({ data });
};

export const createProduct = async (req: Request, res: Response) => {
  const product = await Product.create(req.body);
    res.status(201).json({ data: product });
};

export const updateProductByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (!product) {
    return res.status(404).json({
      error: "Producto no encontrado",
    });
  }
  //Actualizar
  await product.update(req.body)
  await product.save()


  res.json({ data: product });
};

//PATCH
export const updateAvailability = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }
    //Actualizar
    product.availability = !product.dataValues.availability
    await product.save()
    res.json({ data: product });
  };

  export const deleteProductByID = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }
    //Aqui para borrar el producto ese que seleccione con el id de la base de datos
    await product.destroy()
    res.json({data: "Producto Eliminado"})
  };