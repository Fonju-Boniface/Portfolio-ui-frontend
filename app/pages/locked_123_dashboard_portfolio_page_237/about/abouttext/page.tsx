"use client";

import React, { useState, useEffect } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { database } from "../../../../firebase"; // Adjust the path as needed
// import AboutTextField  from './AboutTextField';
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog"; // Import Shadcn dialog components
import AboutTextField from './AboutTextField';

const AboutText = () => {
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const textRef = ref(database, 'your-about-text');
        onValue(textRef, (snapshot) => {
            const snapshotData = snapshot.val();
            setText(snapshotData || '');
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setNotification(null);

        try {
            const textRef = ref(database, 'your-about-text');
            await set(textRef, text);
            setNotification('Text updated successfully!');
        } catch (error) {
            setNotification('Failed to update text.');
        } finally {
            setSubmitting(false);
            setIsDialogOpen(false);
        }
    };

    return (
        <div className="p-8 flex flex-col justify-start items-start">
            <h1 className="text-xl font-bold mb-4">About Text</h1>

            {/* Add Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger>
                    <Button variant="outline">Edit About Text</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>Edit About Text</DialogTitle>
                    <form onSubmit={handleSave} className="space-y-4">
                        <textarea
                            value={text}
                            onChange={handleChange}
                            placeholder="Enter your text here"
                            className="w-full p-2 border border-gray-300 rounded"
                            rows={10}
                        />
                        <Button
                            variant="outline"
                            type="submit"
                            className={`bg-primary w-full text-white flex items-center space-x-2 ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={submitting}
                        >
                            {submitting ? "Saving..." : "Save"}
                        </Button>
                        <DialogClose>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </form>
                </DialogContent>
            </Dialog>
            <AboutTextField />

            {/* Notification */}
            {notification && (
                <div className={`p-4 rounded-md border-b border-gray-300
                    bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl
                    dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static
                    lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 ${notification.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {notification}
                </div>
            )}

           
        </div>
    );
};

export default AboutText;
