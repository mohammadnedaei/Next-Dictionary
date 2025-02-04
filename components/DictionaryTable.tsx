"use client";
import { useState } from "react";
import axios from "axios";
import { Volume2, Edit, Save, X } from "lucide-react";  // Added X icon for cancel
import DeleteWordDialog from "./DeleteWordDialog"; // Import the dialog

interface Word {
    _id: string;
    word: string;
    translation: string;
}

interface DictionaryTableProps {
    words: Word[];
    refreshData: () => void;
}

export default function DictionaryTable({ words, refreshData }: DictionaryTableProps) {
    const [editingWordId, setEditingWordId] = useState<string | null>(null);
    const [editedWord, setEditedWord] = useState<{ word: string; translation: string }>({ word: "", translation: "" });

    const pronounce = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    };

    const startEditing = (word: Word) => {
        setEditingWordId(word._id);
        setEditedWord({ word: word.word, translation: word.translation });
    };

    const cancelEdit = () => {
        setEditingWordId(null);
        setEditedWord({ word: "", translation: "" });  // Reset the edited word state
    };

    const saveEdit = async () => {
        try {
            await axios.put("/api/words", { id: editingWordId, word: editedWord.word, translation: editedWord.translation });
            setEditingWordId(null);
            refreshData();
        } catch (error: unknown) {
            console.error("❌ Error updating word:", error);
            alert("An error occurred while updating. Please try again.");
        }
    };

    return (
        <div className="p-1">
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 shadow-lg rounded-lg overflow-hidden">
                    <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="p-3 text-left">Word</th>
                        <th className="p-3 text-left">Translation</th>
                        <th className="p-3 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {words.map((w) => (
                        <tr key={w._id} className="border-b hover:bg-gray-100 transition">
                            <td className="p-3">
                                {editingWordId === w._id ? (
                                    <input
                                        type="text"
                                        value={editedWord.word}
                                        onChange={(e) => setEditedWord({ ...editedWord, word: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                ) : (
                                    <span className="text-lg">{w.word}</span>
                                )}
                            </td>
                            <td className="p-3">
                                {editingWordId === w._id ? (
                                    <input
                                        type="text"
                                        value={editedWord.translation}
                                        onChange={(e) => setEditedWord({ ...editedWord, translation: e.target.value })}
                                        className="w-full p-2 border rounded"
                                    />
                                ) : (
                                    <span className="text-lg">{w.translation}</span>
                                )}
                            </td>
                            <td className="p-3 flex items-center justify-center space-x-3">
                                {editingWordId === w._id ? (
                                    <>
                                        <button onClick={saveEdit} className="text-green-600 hover:text-green-800">
                                            <Save size={30} />
                                        </button>
                                        <button onClick={cancelEdit} className="text-red-600 hover:text-red-800">
                                            <X size={30} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => pronounce(w.word)} className="text-blue-600 hover:text-blue-800">
                                            <Volume2 size={30} />
                                        </button>
                                        <button onClick={() => startEditing(w)} className="text-yellow-600 hover:text-yellow-800">
                                            <Edit size={25} />
                                        </button>
                                        <DeleteWordDialog id={w._id} refreshData={refreshData} />
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
