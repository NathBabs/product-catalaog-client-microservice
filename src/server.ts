import * as dotenv from 'dotenv';
dotenv.config();
import app from './app';
import connectDatabase from './database/connection';
import logger from './utils/logger'
import { consume } from './consumer/consumer';


const port = process.env.PORT || 1337

app.listen(port, async () => {
    connectDatabase();
    consume();
    logger.info(`App is running on port ${port}`);
})