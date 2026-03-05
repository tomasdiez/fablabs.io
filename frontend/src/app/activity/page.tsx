"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, MapPin, User, FolderGit2, Calendar as CalendarIcon, Loader2, ArrowRight } from "lucide-react";

interface ActivityRecord {
    id: string;
    type: string;
    attributes: {
        action: string;
        created_at: string;
        trackable_type: string;
        trackable_id: number;
        actor: {
            id: number;
            name: string;
            slug: string;
        } | null;
        trackable: {
            id: number;
            type: string;
            name: string;
            slug: string;
        } | null;
    };
}

export default function ActivityFeedPage() {
    const [activities, setActivities] = useState<ActivityRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchActivities() {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));

                const mockActivities: ActivityRecord[] = [
                    {
                        id: "1", type: "activity",
                        attributes: {
                            action: "joined", created_at: new Date().toISOString(), trackable_type: "User", trackable_id: 1,
                            actor: { id: 1, name: "Tomas Diez", slug: "tomasdiez" },
                            trackable: { id: 1, type: "User", name: "Tomas Diez", slug: "tomasdiez" }
                        }
                    },
                    {
                        id: "2", type: "activity",
                        attributes: {
                            action: "created", created_at: new Date(Date.now() - 3600000).toISOString(), trackable_type: "Lab", trackable_id: 2,
                            actor: { id: 1, name: "Admin", slug: "admin" },
                            trackable: { id: 2, type: "Lab", name: "Global Fab Lab", slug: "global-fab-lab" }
                        }
                    }
                ];
                setActivities(mockActivities);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchActivities();
    }, []);

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return `${seconds} seconds ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minutes ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hours ago`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days} days ago`;
        const months = Math.floor(days / 30);
        if (months < 12) return `${months} months ago`;
        return `${Math.floor(months / 12)} years ago`;
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case 'Lab': return <MapPin className="w-5 h-5 text-blue-500" />;
            case 'User': return <User className="w-5 h-5 text-green-500" />;
            case 'Project': return <FolderGit2 className="w-5 h-5 text-purple-500" />;
            case 'Event': return <CalendarIcon className="w-5 h-5 text-orange-500" />;
            default: return <Activity className="w-5 h-5 text-muted-foreground" />;
        }
    };

    const getActivityText = (attr: ActivityRecord['attributes']) => {
        const actorName = attr.actor?.name || "A member";
        const trackableName = attr.trackable?.name || attr.trackable_type;
        const action = attr.action; // e.g., 'created', 'joined', 'updated'

        if (attr.trackable_type === 'User' && action === 'joined') {
            return <><span className="font-medium text-foreground">{actorName}</span> joined the fab network</>;
        }

        return (
            <>
                <span className="font-medium text-foreground">{actorName}</span> {action} {attr.trackable_type.toLowerCase()}{" "}
                <span className="font-medium text-foreground">{trackableName}</span>
            </>
        );
    };

    const getTrackableLink = (attr: ActivityRecord['attributes']) => {
        if (!attr.trackable?.slug || !attr.trackable_type) return null;

        switch (attr.trackable_type) {
            case 'Lab': return `/labs/${attr.trackable.slug}`;
            case 'User': return `/users/${attr.trackable.slug}`;
            case 'Project': return `/projects/${attr.trackable.slug}`;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-secondary/30 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <header className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
                        <Activity className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                        Activity Feed
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Real-time updates, new labs, and milestones from across the global digital fabrication network.
                    </p>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-center">
                        Failed to load activity feed: {error}
                    </div>
                ) : activities.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-xl border shadow-sm">
                        <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium">No activity yet</h3>
                        <p className="text-muted-foreground">Check back later for updates from the network.</p>
                    </div>
                ) : (
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                        {activities.map((activity, idx) => {
                            const attr = activity.attributes;
                            const link = getTrackableLink(attr);

                            return (
                                <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-secondary/30 bg-background shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110 duration-300">
                                        {getIconForType(attr.trackable_type)}
                                    </div>

                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                                <time dateTime={attr.created_at} className="font-medium text-foreground/60">
                                                    {formatTimeAgo(attr.created_at)}
                                                </time>
                                                <span className="px-2 py-0.5 rounded-full bg-secondary/80 text-secondary-foreground font-semibold text-[10px] uppercase tracking-widest">
                                                    {attr.trackable_type}
                                                </span>
                                            </div>

                                            <p className="text-sm leading-relaxed text-foreground/90">
                                                {getActivityText(attr)}
                                            </p>

                                            {link && (
                                                <Link href={link} className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors mt-2 group/link">
                                                    View details <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
