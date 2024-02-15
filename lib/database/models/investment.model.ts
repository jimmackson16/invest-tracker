import { Schema, model, models } from "mongoose";

export interface IInvestment extends Document {
    _id: string;
    product: string;
    amount: string;
    term: string;
    user: {_id: string, firstName: string, email:string, lastName: string}
    returnPercentage: string;
}

const InvestmentSchema = new Schema({
    product: { type: String, required: true},
    amount: { type: String, required: true},
    term: { type: String, required: true},
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    returnPercentage: { type: String, required: true},

}, {timestamps:true})

const Investment = models.Investment || model('Investment', InvestmentSchema)

export default Investment;