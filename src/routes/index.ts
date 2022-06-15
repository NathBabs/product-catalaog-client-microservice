import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
import express from "express";
const router = express.Router();

import * as fs from 'fs'
import path, { dirname, join } from 'path';
const __dirname = dirname(__filename);


const basename = path.basename(__filename);

fs.readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js" || file.slice(-3) === ".ts"
        );
    })
    .map(async file => {
        const module = await import(`./${file}`);
        const routes = module.default;
        router.use(routes);
    });

export default router;
