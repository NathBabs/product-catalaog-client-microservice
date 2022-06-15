import { ProductModel } from '../models/product';
import { customError } from '../utils/CustomError';
import log from '../utils/logger';
import axios from 'axios';

export const createProduct = async (msg: string): Promise<void> => {
  const product = JSON.parse(msg);
  const productmodel = new ProductModel({
    admin_id: parseInt(product.id),
    title: product.title,
    image: product.image,
    likes: product.likes,
  });
  await productmodel.save();
  log.info(`::: Product ${product.title} created`);
}

export const updatedProduct = async (msg: string): Promise<void> => {
  // get product from database
  const product = JSON.parse(msg);

  // update for only fields that are present in product object
  const dataToUpdate: Record<string, string | number> = {};

  Object.keys(product).forEach(key => {
    if (key === 'id') {
      dataToUpdate['admin_id'] = parseInt(product[key]);
    } else {
      dataToUpdate[`${key}`] = product[key];

    }
  });

  ProductModel.findOneAndUpdate({ admin_id: parseInt(product.id) }, { $set: dataToUpdate }, { new: true }, function (err, doc) {
    if (err) {
      log.error(err);
    } else {
      log.info(`::: Product ${doc?.title} updated`);
    }
  }
  );
}

export const deleteProduct = async (msg: string): Promise<void> => {
  const id = parseInt(msg);
  const product = await ProductModel.findOne({ admin_id: id });
  if (!product) {
    log.error(`::: Product ${id} not found`);
  }
  await ProductModel.deleteOne({ admin_id: id });
  log.info(`::: Product ${id} deleted`);
}

/* interface Productmodel {
  [key: string]: any;
} */

export const getAllProducts = async () => {
  try {
    const products = await ProductModel.find();

    return Promise.resolve({
      statusCode: 200,
      data: products,
    });
  } catch (error: any) {
    return Promise.reject(
      customError({
        message: error.message || 'Something went wrong',
        statusCode: 500,
      })
    );
  }
}

// like product, increase likes by 1
export const likeProduct = async (id: string) => {
  try {
    // check if product exists, if not return error
    const existingProduct = await ProductModel.findOne({
      _id: id,
    });

    if (!existingProduct) {
      return Promise.reject(
        customError({
          message: 'Product not found',
          statusCode: 404,
        }));
    }

    await axios.post(`http://localhost:80/api/products/${existingProduct?.admin_id}/like`, {});

    const updatedProduct = await ProductModel.findOneAndUpdate({ _id: id }, { $inc: { likes: 1 } }, { new: true });

    return Promise.resolve({
      statusCode: 200,
      data: updatedProduct,
    });

  } catch (error: any) {
    return Promise.reject(
      customError({
        message: error.message || 'Something went wrong',
        statusCode: 500,
      })
    );
  }
}