import { Request, Response, NextFunction } from 'express';
import { getAllProducts, likeProduct } from '../services/product.service';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    getAllProducts().then(result => {
        res.status(result.statusCode).send({
            status: true,
            data: result.data
        });
    }).catch(error => { 
        next(error);
    });
}

export const likeAProduct = async (req: Request, res: Response, next: NextFunction) => { 
    const id = req.params.id;
    likeProduct(id).then(result => {
        res.status(result.statusCode).send({
            status: true,
            data: result.data
        });
    }).catch(error => { 
        next(error);
    });
}