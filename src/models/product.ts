import pkg from '@typegoose/typegoose';
const { getModelForClass, prop } = pkg;

class ProductClass {
    @prop()
    admin_id?: number;

    @prop()
    title?: string;

    @prop()
    image?: string;

    @prop()
    likes?: number;
}

export const ProductModel = getModelForClass(ProductClass);

