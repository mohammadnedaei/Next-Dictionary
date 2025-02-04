"use client";
import { useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {Trash2} from "lucide-react";

interface DeleteWordDialogProps {
    id: string;
    refreshData: () => void;
}

export default function DeleteWordDialog({ id, refreshData }: DeleteWordDialogProps) {
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await axios.delete("/api/words", { data: { id } });
            setOpen(false);
            refreshData();
        } catch (error) {
            console.error("❌ Error deleting word:", error);
            alert("An error occurred while deleting the word. Please try again.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="text-red-600 hover:text-red-800">
                    <Trash2 size={25} />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this word? This action cannot be undone.
                </DialogDescription>
                <div className="flex justify-end mt-4 space-x-2">
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Confirm Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
