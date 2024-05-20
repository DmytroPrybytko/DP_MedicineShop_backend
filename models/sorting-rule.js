import { Schema, model } from 'mongoose';

const SortingRuleSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        rule: {
            key: {
                type: String,
                required: true,
            },
            direction: {
                type: Number,
                required: true,
            },
        },
    },
    {
        timestamps: true,
    },
);

export default model('SortingRule', SortingRuleSchema);
