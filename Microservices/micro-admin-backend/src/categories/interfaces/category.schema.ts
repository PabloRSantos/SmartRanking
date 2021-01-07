import { Schema } from 'mongoose';

export const CategorySchema = new Schema(
    {
        category: { type: String, unique: true },
        description: String,
        events: [
            {
                name: String,
                operation: String,
                value: Number,
            },
        ],
        players: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Players',
            },
        ],
    },
    { timestamps: true, collection: 'Categories' },
);
