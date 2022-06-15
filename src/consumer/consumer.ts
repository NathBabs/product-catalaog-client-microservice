// import MessageBroker
import { MessageBroker } from '../broker/rabbitmq';
import { createProduct, deleteProduct, updatedProduct } from '../services/product.service';

export const consume = async () => {
    const message = new MessageBroker();
    const broker = await message.init();

    broker.subscribeToQueue('product-created', createProduct);
    broker.subscribeToQueue('product-updated', updatedProduct);
    broker.subscribeToQueue('product-deleted', deleteProduct);
}


