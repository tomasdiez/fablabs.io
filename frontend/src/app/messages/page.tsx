"use client"

import { Button } from "@/components/ui/button";
import { Search, Send, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Messages() {
    const [messages, setMessages] = useState([
        { id: 1, sender: "Fab Lab BCN", text: "Hi Jane! Your onboarding session is confirmed for tomorrow.", time: "10:30 AM", unread: true },
        { id: 2, sender: "John Doe", text: "Could we collaborate on the open-source drone project?", time: "Yesterday", unread: false },
        { id: 3, sender: "System", text: "Your project was successfully published.", time: "Monday", unread: false }
    ]);

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar / Conversatons List */}
            <div className="w-[350px] border-r flex flex-col bg-card">
                <header className="p-4 border-b flex items-center justify-between">
                    <Link href="/dashboard" className="font-bold text-lg hover:text-primary transition-colors">
                        &larr; Inbox
                    </Link>
                    <Button variant="ghost" size="icon"><EditIcon className="w-5 h-5" /></Button>
                </header>
                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full pl-9 pr-4 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-auto">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`p-4 border-b cursor-pointer hover:bg-secondary/50 transition-colors ${msg.unread ? 'bg-secondary/20' : ''}`}>
                            <div className="flex justify-between items-start mb-1">
                                <span className={`font-semibold ${msg.unread ? 'text-primary' : ''}`}>{msg.sender}</span>
                                <span className="text-xs text-muted-foreground">{msg.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{msg.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Conversation Area */}
            <div className="flex-1 flex flex-col bg-secondary/10 relative">
                <header className="h-16 border-b bg-card flex items-center px-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            F
                        </div>
                        <div>
                            <h2 className="font-semibold">Fab Lab BCN</h2>
                            <p className="text-xs text-muted-foreground text-green-500">Online</p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-6 space-y-6">
                    <div className="flex flex-col items-center text-xs text-muted-foreground my-4">
                        Today
                    </div>
                    <div className="flex justify-start">
                        <div className="bg-card border p-3 rounded-2xl rounded-tl-none max-w-[70%] shadow-sm">
                            <p>Hi Jane! Your onboarding session is confirmed for tomorrow.</p>
                            <p className="text-[10px] text-muted-foreground mt-1 text-right">10:30 AM</p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-none max-w-[70%] shadow-sm">
                            <p>Perfect, thank you! Do I need to bring my laptop?</p>
                            <p className="text-[10px] text-primary-foreground/70 mt-1 text-right">10:32 AM</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-card border-t">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Type your message... (WebSocket integration pending)"
                            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        />
                        <Button size="icon" className="rounded-full shrink-0">
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EditIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 Z" /></svg>
    )
}
