"use client";
import { useState } from "react";
import axios from "axios";

interface AddWordFormProps {
    refreshData: () => void;
}

export default function AddWordForm({ refreshData }: AddWordFormProps) {
    const [word, setWord] = useState("");
    const [translation, setTranslation] = useState("");
    const [error, setError] = useState<string | null>(null);

    const addWord = async () => {
        try {
            await axios.post("/api/words", { word, translation });
            setWord("");
            setTranslation("");
            setError(null);
            refreshData(); // Refresh the data after adding a word
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                if (err.response && err.response.status === 409) {
                    setError("This word already exists.");
                } else {
                    setError("An error occurred. Please try again.");
                }
            } else {
                setError("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="p-4">
            <input
                className="border rounded-lg p-2 m-2"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="Word"
            />
            <input
                className="border p-2 rounded-lg m-2"
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                placeholder="Translation"
            />
            <button
                className="m-2 bg-slate-600 text-white text-center px-4 py-3 rounded-xl hover:bg-slate-500 transition-all shadow-2xl ml-2"
                onClick={addWord}
            >
                Add
            </button>
            {error && (
                <div className="mt-4 bg-red-100 text-red-700 p-2 rounded-lg shadow">
                    {error}
                </div>
            )}
        </div>
    );
}
