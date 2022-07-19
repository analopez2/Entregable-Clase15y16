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
  const response = await ProductApi.getAll();

  if (!response) res.send({ error: productNotFound });

  res.send({ productos: response });
});

export { productRouter };
