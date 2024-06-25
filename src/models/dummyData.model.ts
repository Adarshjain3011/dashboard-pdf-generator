import mongoose, { Document, Schema, Model, model } from "mongoose";

interface IDummyData extends Document {
    title: string;
    content: string;
    imageUrl: string;
    pdfUrl:string;
}

const DummyDataSchema: Schema = new Schema({

    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, },
    pdfUrl: { type: String, required: true },

},{

    timestamps:true,
});

const DummyData: Model<IDummyData> = mongoose.models.DummyData || model<IDummyData>('DummyData', DummyDataSchema);

export default DummyData;



