import { Schema, Model , model ,Document} from 'mongoose';
import { ICategory } from '../interfaces/category.interface';
import { ObjectID } from 'bson';

// const children = new Schema({
//     title: {
//         required: [true , Messages.category.titleIsRequired]
//     }, 
//     children: []
// })

export const CategorySchema = new Schema({
    userId: {
        type: String,
        required: [true]
    },
   data: []
});

export const Category: Model<ICategoriesDbEntity> = model<ICategoriesDbEntity>('Category' , CategorySchema);

interface ICategoriesDbEntity extends Document {
    _id: ObjectID
    userId: string;
    data: ICategory[]
}