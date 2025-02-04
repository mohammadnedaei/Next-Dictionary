import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Word from "@/lib/models/Word";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log("🔵 Connecting to MongoDB...");
        await connectDB();
        console.log("🟢 Connected to MongoDB!");

        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            console.log("❌ Unauthorized request: No session user email found");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("🟢 Session found, fetching words...");
        const words = await Word.find({ userId: session.user.email }).exec();
        console.log("🟢 Words fetched:", words);

        return NextResponse.json(words);
    } catch (error) {
        console.error("❌ Error in GET /api/words:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        console.log("🔵 Connecting to MongoDB...");
        await connectDB();
        console.log("🟢 Connected to MongoDB!");

        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            console.log("❌ Unauthorized request: No session user email found");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { word, translation } = await req.json();
        if (!word || !translation) {
            return NextResponse.json({ error: "Word and translation are required" }, { status: 400 });
        }

        const existingWord = await Word.findOne({
            userId: session.user.email,
            word: new RegExp(`^${word}$`, "i")
        });

        if (existingWord) {
            console.log("❌ Word already exists:", existingWord);
            return NextResponse.json({ error: "Word already exists" }, { status: 409 });
        }

        const newWord = await Word.create({ userId: session.user.email, word, translation });
        console.log("🟢 Word added:", newWord);
        return NextResponse.json(newWord, { status: 201 });
    } catch (error) {
        console.error("❌ Error in POST /api/words:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        console.log("🔵 Connecting to MongoDB...");
        await connectDB();
        console.log("🟢 Connected to MongoDB!");

        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            console.log("❌ Unauthorized request: No session user email found");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: "Word ID is required" }, { status: 400 });
        }

        const deletedWord = await Word.findOneAndDelete({ _id: id, userId: session.user.email });
        if (!deletedWord) {
            return NextResponse.json({ error: "Word not found or unauthorized" }, { status: 404 });
        }

        console.log("🟢 Word deleted:", deletedWord);
        return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("❌ Error in DELETE /api/words:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        console.log("🔵 Connecting to MongoDB...");
        await connectDB();
        console.log("🟢 Connected to MongoDB!");

        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            console.log("❌ Unauthorized request: No session user email found");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, word, translation } = await req.json();
        if (!id || !word || !translation) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Check for another word with the same name (case-insensitive) and different ID
        const conflictingWord = await Word.findOne({
            userId: session.user.email,
            word: new RegExp(`^${word}$`, "i"),  // Case-insensitive match
            _id: { $ne: id },  // Exclude the current word's ID
        });

        if (conflictingWord) {
            console.log("❌ Word already exists:", conflictingWord);
            return NextResponse.json({ error: "Word already exists" }, { status: 409 });
        }

        // Update the word and translation
        const updatedWord = await Word.findOneAndUpdate(
            { _id: id, userId: session.user.email },
            { word, translation },
            { new: true }  // Return the updated document
        );

        if (!updatedWord) {
            console.log("❌ Word not found or unauthorized");
            return NextResponse.json({ error: "Word not found or unauthorized" }, { status: 404 });
        }

        console.log("🟢 Word updated:", updatedWord);
        return NextResponse.json({ message: "Updated successfully", updatedWord }, { status: 200 });

    } catch (error) {
        console.error("❌ Error in PUT /api/words:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
