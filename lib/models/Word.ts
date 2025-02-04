import mongoose from "mongoose";

const WordSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    word: { type: String, required: true },
    translation: { type: String, required: true },
});

export default mongoose.models.Word || mongoose.model("Word", WordSchema);
