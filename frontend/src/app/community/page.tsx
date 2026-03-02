"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Community() {
    const [threads, setThreads] = useState([
        {
            id: 1,
            title: "Best settings for 3mm birch plywood on Epilog 60W?",
            author: "Alex Morgan",
            category: "Laser Cutting",
            replies: 12,
            likes: 8,
            time: "2h ago"
        },
        {
            id: 2,
            title: "Announcing the new Open Hardware challenge!",
            author: "Fab Foundation",
            category: "News",
            replies: 45,
            likes: 120,
            time: "1d ago"
        },
        {
            id: 3,
            title: "Help needed with NodeMCU v3 mapping",
            author: "MakerDave",
            category: "Electronics",
            replies: 3,
            likes: 2,
            time: "3d ago"
        }
    ]);

    return (
        <div className="min-h-screen bg-secondary/20">
            <header className="bg-card border-b">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="font-bold text-xl tracking-tighter hover:text-primary transition-colors">
                        fablabs<span className="text-primary">.io</span> Community
                    </Link>
                    <div className="flex items-center gap-4">
                        <Button>New Topic</Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="grid md:grid-cols-[200px_1fr] gap-8">

                    {/* Categories Sidebar */}
                    <aside className="space-y-6">
                        <div className="space-y-1">
                            <h3 className="font-semibold px-3 py-2 text-muted-foreground">Categories</h3>
                            <Button variant="ghost" className="w-full justify-start font-bold">All Topics</Button>
                            <Button variant="ghost" className="w-full justify-start text-muted-foreground">News</Button>
                            <Button variant="ghost" className="w-full justify-start text-muted-foreground">Digital Fabrication</Button>
                            <Button variant="ghost" className="w-full justify-start text-muted-foreground">Electronics</Button>
                            <Button variant="ghost" className="w-full justify-start text-muted-foreground">Software</Button>
                        </div>
                    </aside>

                    {/* Threads List */}
                    <div className="space-y-4">
                        {threads.map((thread) => (
                            <div key={thread.id} className="p-4 rounded-xl bg-card border hover:border-primary cursor-pointer transition-colors shadow-sm">
                                <div className="flex gap-2 mb-2">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-primary bg-primary/10 px-2 rounded-full flex items-center">
                                        {thread.category}
                                    </span>
                                </div>
                                <h2 className="text-lg font-bold mb-2">{thread.title}</h2>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><User className="w-4 h-4" /> {thread.author}</span>
                                    <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {thread.replies}</span>
                                    <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" /> {thread.likes}</span>
                                    <span>• {thread.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </main>
        </div>
    );
}
