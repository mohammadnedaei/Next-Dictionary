"use client";
import { useState, useEffect } from "react";

import AddWordForm from "@/components/AddWordForm";
import DictionaryTable from "@/components/DictionaryTable";
import axios from "axios";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
    const [words, setWords] = useState([]);

    // Function to fetch data
    const fetchData = async () => {
        const res = await axios.get("/api/words");
        setWords(res.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <ProtectedRoute>

        <div>
            <AddWordForm refreshData={fetchData} />
            <DictionaryTable words={words} refreshData={fetchData} />
        </div>
        </ProtectedRoute>
    );
}
