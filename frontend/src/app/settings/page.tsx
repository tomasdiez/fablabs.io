"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, User, Link as LinkIcon, Camera, AlertCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserProfile {
    id: number;
    first_name: string | null;
    last_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    city: string | null;
    country_code: string | null;
    links: { id: number, url: string }[];
}

interface IncludedLink {
    id: string;
    url: string;
}

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [links, setLinks] = useState<{ id?: string; url: string; _destroy?: boolean }[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Form Fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [bio, setBio] = useState("");
    const [city, setCity] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        } else if (status === "authenticated" && session?.accessToken) {
            fetchProfile();
        }
    }, [status, session]);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/profile`, {
                headers: {
                    "Authorization": `Bearer ${session?.accessToken}`,
                    "Content-Type": "application/json"
                }
            });
            if (!res.ok) throw new Error("Failed to load profile settings.");

            const resultJson = await res.json();
            const updatedUser = resultJson;

            setProfile(updatedUser);
            setFirstName(updatedUser.first_name || "");
            setLastName(updatedUser.last_name || "");
            setBio(updatedUser.bio || "");
            setCity(updatedUser.city || "");
            setCountryCode(updatedUser.country_code || "");
            setAvatarPreview(updatedUser.avatar_url || null);

            if (updatedUser.links && Array.isArray(updatedUser.links)) {
                const updatedLinks = updatedUser.links.map((link: any) => ({
                    id: link.id.toString(),
                    url: link.url
                }));
                setLinks(updatedLinks);
            } else {
                setLinks([]);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccessMsg(null);

        try {
            let body;
            let headers: any = {
                "Authorization": `Bearer ${session?.accessToken}`
            };

            if (avatarFile) {
                const formData = new FormData();
                formData.append('user[first_name]', firstName);
                formData.append('user[last_name]', lastName);
                formData.append('user[bio]', bio);
                formData.append('user[city]', city);
                formData.append('user[country_code]', countryCode);
                formData.append('user[avatar]', avatarFile);
                links.forEach((link, idx) => {
                    if (link.id) formData.append(`user[links_attributes][${idx}][id]`, link.id);
                    if (link.url) formData.append(`user[links_attributes][${idx}][url]`, link.url);
                    if (link._destroy) formData.append(`user[links_attributes][${idx}][_destroy]`, '1');
                });
                body = formData;
            } else {
                body = JSON.stringify({
                    user: {
                        first_name: firstName,
                        last_name: lastName,
                        bio,
                        city,
                        country_code: countryCode,
                        links_attributes: links
                    }
                });
                headers["Content-Type"] = "application/json";
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/profile`, {
                method: "PUT",
                headers,
                body
            });

            if (!res.ok) {
                const errJson = await res.json();
                throw new Error(errJson.error || "Failed to update profile.");
            }

            setSuccessMsg("Profile successfully updated.");
            setAvatarFile(null); // Reset file selection after successful upload
            fetchProfile(); // Refresh to get clean IDs for newly created links
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const updateLink = (index: number, value: string) => {
        const newLinks = [...links];
        newLinks[index].url = value;
        setLinks(newLinks);
    };

    const removeLink = (index: number) => {
        const newLinks = [...links];
        if (newLinks[index].id) {
            // Mark for backend destruction
            newLinks[index]._destroy = true;
        } else {
            // Just remove from local state if it was never saved
            newLinks.splice(index, 1);
        }
        setLinks(newLinks);
    };

    const addLink = () => {
        setLinks([...links, { url: "" }]);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-secondary/20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary/20 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Account Settings</h1>
                        <p className="text-muted-foreground mt-1">Manage your public maker profile and ecosystem connections.</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {successMsg && (
                    <div className="mb-6 bg-green-500/10 text-green-600 border-green-500/20 p-4 rounded-xl border flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs shrink-0">✓</div>
                        <p className="text-sm font-medium">{successMsg}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Settings Sidebar Menu (Optional expansion later) */}
                    <div className="col-span-1 space-y-2">
                        <Button variant="secondary" className="w-full justify-start font-semibold">
                            <User className="w-4 h-4 mr-2" />
                            Public Profile
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground" disabled>
                            <LinkIcon className="w-4 h-4 mr-2" />
                            Linked Labs (Coming soon)
                        </Button>
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-8">
                        <form onSubmit={handleSave} className="space-y-8">
                            {/* Basic Info Card */}
                            <div className="bg-card rounded-2xl border p-6 shadow-sm">
                                <h2 className="text-lg font-bold mb-4">Personal Details</h2>

                                <div className="flex items-center gap-6 mb-6">
                                    <div className="relative w-24 h-24 rounded-full bg-secondary/50 border flex items-center justify-center overflow-hidden shrink-0">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-8 h-8 text-muted-foreground" />
                                        )}
                                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                            <Camera className="w-6 h-6 text-white" />
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setAvatarFile(file);
                                                        setAvatarPreview(URL.createObjectURL(file));
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Profile Picture</h3>
                                        <p className="text-sm text-muted-foreground">Upload a professional looking picture of yourself. Max 5MB.</p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-sm font-medium">First Name</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={e => setFirstName(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <label className="text-sm font-medium">Last Name</label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={e => setLastName(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <label className="text-sm font-medium">Bio</label>
                                    <textarea
                                        value={bio}
                                        onChange={e => setBio(e.target.value)}
                                        rows={4}
                                        placeholder="Tell the community about your maker journey..."
                                        className="w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-y"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-sm font-medium">City</label>
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={e => setCity(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div className="w-full sm:w-1/3 space-y-2">
                                        <label className="text-sm font-medium">Country Code</label>
                                        <input
                                            type="text"
                                            value={countryCode}
                                            onChange={e => setCountryCode(e.target.value)}
                                            maxLength={2}
                                            placeholder="US, ES, FR"
                                            className="w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all uppercase"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* External Portfolio Links Card */}
                            <div className="bg-card rounded-2xl border p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold">External Portfolios</h2>
                                    <Button type="button" variant="outline" size="sm" onClick={addLink} className="gap-1 h-8">
                                        <Plus className="w-3 h-3" /> Add Link
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Link your GitHub, Wikifactory, Thingiverse, or personal website so other makers can discover your projects.
                                </p>

                                <div className="space-y-3">
                                    {links.map((link, idx) => {
                                        if (link._destroy) return null; // Hide locally destroyed links
                                        return (
                                            <div key={idx} className="flex items-center gap-2 group">
                                                <div className="flex-1 relative">
                                                    <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                                    <input
                                                        type="url"
                                                        placeholder="https://github.com/yourusername"
                                                        value={link.url}
                                                        onChange={(e) => updateLink(idx, e.target.value)}
                                                        className="w-full pl-9 pr-3 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all text-sm"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeLink(idx)}
                                                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                    {links.filter(l => !l._destroy).length === 0 && (
                                        <div className="text-center py-6 border-2 border-dashed rounded-xl bg-secondary/30 text-muted-foreground text-sm">
                                            No external links added yet.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Footer */}
                            <div className="flex justify-end pt-4 border-t">
                                <Button type="submit" size="lg" disabled={saving} className="min-w-32">
                                    {saving ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                                    ) : (
                                        <><Save className="w-4 h-4 mr-2" /> Save Changes</>
                                    )}
                                </Button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
