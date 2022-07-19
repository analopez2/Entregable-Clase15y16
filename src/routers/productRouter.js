import { Router } from 'express';
import { productNotFound, prorductWasDeleted } from '../consts/index.js';
import { DbContainer } from '../Api/DbContainer.js';

const productRouter = Router();
const ProductApi = new DbContainer();

productRouter.get('/', async (req, res) => {
  const response = await ProductApi.getAll();

  if (!response) res.send({ error: productNotFound });

  res.render('partials/productos', { productos: response });
});

productRouter.post('/', async (req, res) => {
  const product = req.body;
  await ProductApi.save(product);

  res.redirect('/');
});

productRouter.get('/lista-productos', async (req, res) => {
  try {
    const products = await ProductApi.getAll();
    res.send(products);
  } catch (error) {
    res.statusCode(404).send({ error: error });
  }
});

productRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductApi.getById(id);

    if (!product) {
      throw { error: ERRORS_UTILS.MESSAGES.NO_PRODUCT };
    }

    res.send(product);
  } catch (error) {
    res.statusCode(400).send({ error: error });
  }
});

productRouter.post('/nuevo-producto', isAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, codigo, foto, precio, stock } = req.body;

    const product = await JOI_VALIDATOR.product.validateAsync({
      nombre,
      descripcion,
      codigo,
      foto,
      precio,
      stock,
    });

    const productSaved = await ProductApi.save(product);

    res.send(productSaved);
  } catch (error) {
    res.statusCode(400).send({ error: error });
  }
});

productRouter.put('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, codigo, foto, precio, stock } = req.body;

    const product = await JOI_VALIDATOR.product.validateAsync({
      nombre,
      descripcion,
      codigo,
      foto,
      precio,
      stock,
    });

    const productUpdate = await ProductApi.updateById(id, product);

    res.send(productUpdate);
  } catch (error) {
    res.statusCode(400).send({ error: error });
  }
});

productRouter.delete('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductApi.getById(id);
    if (!product) {
      throw { error: ERRORS_UTILS.MESSAGES.NO_PRODUCT };
    }
    const productDelete = await ProductApi.deleteById(id);

    res.send({
      mensaje: 'Producto eliminado',
      productoEliminado: productDelete,
    });
  } catch (error) {
    res.statusCode(404).send({ error: error });
  }
});

export { productRouter };
