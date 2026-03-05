export interface GenericLocation {
    latitude: number;
    longitude: number;
    city?: string;
    country_code?: string;
    label?: string;
}

export interface GenericLink {
    id?: string;
    url: string;
    title?: string;
}

export interface GenericUser {
    id: string | number;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    city: string | null;
    country_code: string | null;
    links: GenericLink[];
    badges: string[];
}

export interface GenericLab {
    id: string | number;
    name: string;
    slug: string;
    description: string | null;
    avatar_url?: string | null;
    location: GenericLocation;
    links: GenericLink[];
}

export interface GenericActivity {
    id: string | number;
    action: string;
    timestamp: string;
    actor: GenericUser | GenericLab;
    target?: GenericLab | GenericUser | { name: string; url: string };
}

export interface OrchestrationNode {
    id: string;
    type: "Lab" | "MakeWorks" | "DistributedDesign" | "FabCity";
    name: string;
    description: string;
    location: {
        latitude: number;
        longitude: number;
        city?: string;
        country_code?: string;
    };
    avatar_url?: string;
    url: string;
}
