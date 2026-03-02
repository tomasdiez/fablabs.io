import Link from "next/link";
import { ArrowRight, MapPin, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tighter">
              fablabs<span className="text-primary">.io</span>
            </span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/labs" className="hover:text-primary transition-colors">
              Labs Map
            </Link>
            <Link href="/projects" className="hover:text-primary transition-colors">
              Projects
            </Link>
            <Link href="/community" className="hover:text-primary transition-colors">
              Community
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Sign In
            </a>
            <Button>Join Network</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background py-24 md:py-32">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[100px]" />
          </div>

          <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              The Global Network of <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                Digital Fabrication
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with thousands of makers, discover cutting-edge projects, and locate the nearest Fab Lab to turn your ideas into reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <MapPin className="w-4 h-4" />
                Find a Lab
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                <Search className="w-4 h-4" />
                Explore Projects
              </Button>
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="py-24 bg-secondary/50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <MapPin className="w-8 h-8 text-primary" />,
                  title: "Interactive Global Map",
                  description: "Explore 2,000+ active Fab Labs worldwide. View capabilities, machinery, and local communities instantly."
                },
                {
                  icon: <Users className="w-8 h-8 text-primary" />,
                  title: "Vibrant Community",
                  description: "Connect with makers, share knowledge, and collaborate on open-source hardware projects."
                },
                {
                  icon: <Search className="w-8 h-8 text-primary" />,
                  title: "Advanced Discovery",
                  description: "Search across projects, users, and machines to find exactly what you need to build your idea."
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-card">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Fablabs.io. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
