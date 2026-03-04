import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    MapPin,
    Calendar,
    Settings,
    Briefcase,
    ExternalLink,
    Twitter,
    Github,
    Instagram,
    Facebook,
    Linkedin,
    Youtube,
    Monitor,
    Link as LinkIcon,
    Box,
    GraduationCap,
    Tent,
    Globe,
    BookOpen
} from "lucide-react";
import { format } from "date-fns";
import { Gitlab } from "lucide-react"; // Custom SVG wrapper if Lucide doesn't have it natively, but Lucide has Gitlab.

// Extracted Domain Parser logic for External Repositories
function getDomainIcon(url: string) {
    if (!url) return <LinkIcon className="w-5 h-5 text-muted-foreground" />;
    const lower = url.toLowerCase();
    if (lower.includes('thingiverse.com') || lower.includes('printables.com') || lower.includes('makerworld.com')) return <Box className="w-5 h-5 text-blue-500" />;
    if (lower.includes('wikifactory.com')) return <Briefcase className="w-5 h-5 text-red-500" />;
    if (lower.includes('github.com')) return <Github className="w-5 h-5" />;
    if (lower.includes('gitlab.com')) return <Gitlab className="w-5 h-5 text-orange-500" />;
    return <LinkIcon className="w-5 h-5 text-muted-foreground" />;
}

function getDomainName(url: string) {
    try {
        const u = new URL(url);
        return u.hostname.replace('www.', '');
    } catch {
        return 'External Link';
    }
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
    twitter: <Twitter className="w-4 h-4" />,
    github: <Github className="w-4 h-4" />,
    instagram: <Instagram className="w-4 h-4" />,
    facebook: <Facebook className="w-4 h-4" />,
    linkedin: <Linkedin className="w-4 h-4" />,
    youtube: <Youtube className="w-4 h-4" />,
    vimeo: <Monitor className="w-4 h-4" />, // Fallback
    web: <ExternalLink className="w-4 h-4" />
};

export default async function MakerProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    // 1. Fetch data from our new Rails endpoint
    const res = await fetch(`http://127.0.0.1:3001/api/users/${resolvedParams.id}`, { cache: "no-store" });

    if (!res.ok) {
        if (res.status === 404) return notFound();
        throw new Error('Failed to fetch maker profile');
    }

    // ActiveModelSerializer root node elimination isn't guaranteed depending on setup.
    // We'll safely destructure it.
    const rootData = await res.json();
    const user = rootData.user ? rootData.user : rootData;

    const joinDate = user.created_at ? format(new Date(user.created_at), 'MMMM yyyy') : 'Unknown';

    return (
        <div className="min-h-screen bg-background">
            {/* Dynamic Header */}
            <div className="w-full h-64 md:h-80 bg-gradient-to-br from-primary/80 via-primary to-indigo-600 relative overflow-hidden">
                {/* Abstract Pattern overlay */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            </div>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 md:-mt-32 relative z-10 pb-20">

                {/* Main Identity Card */}
                <div className="bg-card rounded-3xl shadow-xl border overflow-hidden">
                    <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start md:items-center">

                        {/* Avatar */}
                        <div className="relative w-32 h-32 md:w-48 md:h-48 shrink-0 rounded-2xl overflow-hidden border-4 border-background bg-secondary shadow-lg">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={user.avatar_url}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Core Info */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{user.name}</h1>
                                <p className="text-xl text-muted-foreground mt-2">@{user.username}</p>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm font-medium text-muted-foreground">
                                {(user.city || user.country_code) && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span>{[user.city, user.country_code].filter(Boolean).join(', ')}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span>Joined {joinDate}</span>
                                </div>
                            </div>

                            {/* Badges Section */}
                            {user.badges && user.badges.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {user.badges.includes("fab_academy") && (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-sm font-bold border border-amber-500/20" title="Graduated Fab Academy">
                                            <GraduationCap className="w-4 h-4" />
                                            <span>Fab Academy</span>
                                        </div>
                                    )}
                                    {user.badges.includes("bootcamp") && (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-bold border border-emerald-500/20" title="Attended a Global Bootcamp">
                                            <Tent className="w-4 h-4" />
                                            <span>Bootcamp Alumni</span>
                                        </div>
                                    )}
                                    {user.badges.includes("global_event") && (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold border border-blue-500/20" title="Participated in a Global Fab Event">
                                            <Globe className="w-4 h-4" />
                                            <span>Global Event</span>
                                        </div>
                                    )}
                                    {user.badges.includes("academic_published") && (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-sm font-bold border border-purple-500/20" title="Verified Academic Publications">
                                            <BookOpen className="w-4 h-4" />
                                            <span>Scholar</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Social Links */}
                            {user.social_links && Object.keys(user.social_links).length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {Object.entries(user.social_links).map(([platform, url]) => (
                                        <a
                                            key={platform}
                                            href={url as string}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-full transition-colors"
                                            title={platform}
                                        >
                                            {PLATFORM_ICONS[platform] || <ExternalLink className="w-4 h-4" />}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bio Section (if exists) */}
                    {user.bio && (
                        <div className="px-8 pb-8 md:px-12 md:pb-12 border-t pt-8">
                            <h3 className="text-lg font-bold mb-4">About</h3>
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                {user.bio}
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Grids */}
                <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Associated Labs */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Affiliated Labs</h2>
                            <span className="ml-auto bg-secondary text-secondary-foreground font-semibold px-3 py-1 rounded-full text-sm">
                                {user.labs?.length || 0}
                            </span>
                        </div>

                        {(!user.labs || user.labs.length === 0) ? (
                            <div className="bg-card border border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center h-48">
                                <Briefcase className="w-8 h-8 text-muted-foreground/30 mb-3" />
                                <p className="text-muted-foreground font-medium">No labs affiliated yet.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {user.labs.map((lab: any) => (
                                    <Link href={`/labs/${lab.slug || lab.id}`} key={lab.id} className="group block">
                                        <div className="bg-card border rounded-2xl p-4 flex items-center gap-4 hover:border-primary hover:shadow-md transition-all">
                                            <div className="w-16 h-16 rounded-xl bg-secondary overflow-hidden shrink-0">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={lab.avatar_url || `https://picsum.photos/seed/lab_${lab.id}/150/150`} alt={lab.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-lg group-hover:text-primary transition-colors truncate">{lab.name}</h3>
                                                <p className="text-sm text-muted-foreground truncate">{[lab.city, lab.country_code].filter(Boolean).join(', ') || 'Global'}</p>
                                            </div>
                                            <ExternalLink className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -mr-2" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* External Repositories */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                <LinkIcon className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">External Repositories</h2>
                            <span className="ml-auto bg-secondary text-secondary-foreground font-semibold px-3 py-1 rounded-full text-sm">
                                {user.links?.length || 0}
                            </span>
                        </div>

                        {(!user.links || user.links.length === 0) ? (
                            <div className="bg-card border border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center h-48">
                                <LinkIcon className="w-8 h-8 text-muted-foreground/30 mb-3" />
                                <p className="text-muted-foreground font-medium">No external portfolios linked yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                                {user.links.map((link: any) => (
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" key={link.id} className="group block">
                                        <div className="bg-card border rounded-2xl p-4 flex items-center gap-4 hover:border-primary hover:shadow-md transition-all">
                                            <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center shrink-0 border border-border/50">
                                                {getDomainIcon(link.url)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-lg group-hover:text-primary transition-colors truncate">{link.description || getDomainName(link.url)}</h3>
                                                <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                                            </div>
                                            <ExternalLink className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -mr-2" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </section>

                </div>
            </main>
        </div>
    );
}
