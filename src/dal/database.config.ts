import * as mongoose from 'mongoose';
import systemConsoleColors from '../config/colors/system-console.colors';
const databaseConfig = require('../config/settings/database.config.json');

 class Database {

    init() {
        (<any>mongoose).Promise = global.Promise;
        mongoose.set('useCreateIndex', true);
        mongoose.connect(databaseConfig.connectionString , {useNewUrlParser: true})
        .then(info => {
            console.log(systemConsoleColors.success, 'Seccessfully connected to mongoDb.');
        }).catch(e => {
            console.log(systemConsoleColors.error , 'Failed to connect mongoDb.');
            console.log(e);
        })
    }
}

export default new Database();