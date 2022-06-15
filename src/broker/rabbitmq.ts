import amqp, { Channel } from 'amqplib/callback_api';
import logger from '../utils/logger';

// create a class to connect to rabbitmq, send  a messsage, subscribe to a queue, and close the connection

export class MessageBroker {
    public instance: MessageBroker | null = null;
    public connection: amqp.Connection | null = null;
    public channel: Channel | null = null;

    constructor() {
        this.instance = this;
    }

    //initialize the connection to rabbitmq
    public async init(): Promise<MessageBroker> { 
        return new Promise((resolve, reject) => {
        amqp.connect(process.env.RABBITMQ_URL as string, (err0, conn) => {
            if (err0) {
                reject(err0);
            }
            this.connection = conn;
            this.connection.createChannel((err1, channel) => { 
                if (err1) {
                    reject(err1);
                }
                logger.info(`Connected to RabbitMQ`);
                this.channel = channel;
                resolve(this);
            }      
            );
        });
    });
    }

    public sendMessage(queue: string, message: string): Promise<void> { 
        return new Promise((resolve, reject) => { 
            this.channel?.assertQueue(queue, { durable: true });
            this.channel?.sendToQueue(queue, Buffer.from(message));
            resolve();
        });
    }


    public subscribeToQueue = (queue: string, callback: (message: string) => void): Promise<void> => {
        return new Promise((resolve, reject) => {
            this.channel?.assertQueue(queue, { durable: true });
            this.channel?.consume(queue, (msg) => {
                if (msg) {
                    callback(msg.content.toString());
                }
            }
                , { noAck: true }
            );
            resolve();
        });
    }

    // get  the instance of the class
    public async getInstance (): Promise<MessageBroker> { 
        if (!this.instance) {
            const broker = new MessageBroker();
             this.instance = await broker.init()
        }
        return this.instance;
    }

    public closeConnection = (): Promise<void> => { 
        return new Promise((resolve, reject) => {
            this.connection?.close();
            resolve();
        });
    }
}