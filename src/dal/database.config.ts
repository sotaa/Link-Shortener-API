import mongoose from 'mongoose';
import databaseConfig from '../config/settings/database.config.json';

 class Database {

    init() {
        (<any>mongoose).Promise = global.Promise;
        mongoose.connect(databaseConfig.connectionString , {useNewUrlParser: true});
        mongoose.set('useCreateIndex', true)
    }
}

export default new Database();