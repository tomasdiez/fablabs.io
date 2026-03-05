import Link from "next/link";
import { ArrowRight, Globe, GraduationCap, Cpu, MapPin, Factory, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pt-16">
        {/* Phase 1: Hero Section (Digital Infrastructure Platform) */}
        <section className="relative overflow-hidden bg-background py-24 md:py-32">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[100px]" />
          </div>

          <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Layers className="w-4 h-4" />
              Powered by INTERFACER
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              The Digital Infrastructure for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                Distributed Production
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              <strong>Fab City OS</strong> is a federated network and Git-based versioning platform connecting local placemaking with global hardware design via Digital Product Passports.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Link href="/dido" className="w-full sm:w-auto">
                <Button size="lg" className="w-full gap-2 hover:scale-105 transition-transform duration-300 shadow-lg h-14 text-lg">
                  Start DIDO Workflow
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Phase 2: Content Modules Grid */}
        <section className="py-24 bg-secondary/30 border-t">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Five Interconnected Modules</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover the core building blocks of the Fab City Operating System.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* Module 1 */}
              <div className="p-8 rounded-3xl bg-card border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Globe className="w-24 h-24" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">Module 1</div>
                <h3 className="text-xl font-bold mb-3">Global Vision & Network</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Interactive directory of 56 pledged cities and regions. Access the Knowledge Library for civic research, the Fab City Manifesto, and global events tracking.
                </p>
                <div className="text-xs font-medium text-muted-foreground mt-auto pt-4 border-t">Powered by Fab City Global Initiative</div>
              </div>

              {/* Module 2 */}
              <div className="p-8 rounded-3xl bg-card border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <GraduationCap className="w-24 h-24" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-purple-500 mb-2">Module 2</div>
                <h3 className="text-xl font-bold mb-3">Learning & Talent Hub</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Directory of 2,000+ creative talents. Integrated learning portal for masterclasses, Fab Academy courses, Fabricademy, and critical publications like Driving Design.
                </p>
                <div className="text-xs font-medium text-muted-foreground mt-auto pt-4 border-t">Powered by Distributed Design & Fab Academy</div>
              </div>

              {/* Module 3 */}
              <div className="p-8 rounded-3xl bg-card border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Cpu className="w-24 h-24" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6">
                  <Cpu className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">Module 3</div>
                <h3 className="text-xl font-bold mb-3">Open Source Hardware</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Git-based workspaces for uploading and versioning hardware designs. Features smart contract collaboration incentives to capture local manufacturing value.
                </p>
                <div className="text-xs font-medium text-muted-foreground mt-auto pt-4 border-t">Powered by Interfacer / Fab City OS</div>
              </div>

              {/* Module 4 */}
              <div className="p-8 rounded-3xl bg-card border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group md:col-span-2 lg:col-span-1">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <MapPin className="w-24 h-24" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Module 4</div>
                <h3 className="text-xl font-bold mb-3">Prototyping Spaces</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Locator for 1,750+ Fab Labs in 100+ countries. Deep facility profiles detailing machines and tools, alongside global community forums for fabbers.
                </p>
                <div className="text-xs font-medium text-muted-foreground mt-auto pt-4 border-t">Powered by Fablabs.io</div>
              </div>

              {/* Module 5 */}
              <div className="p-8 rounded-3xl bg-card border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group md:col-span-2 lg:col-span-2">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Factory className="w-24 h-24" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mb-6">
                  <Factory className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-green-500 mb-2">Module 5</div>
                <h3 className="text-xl font-bold mb-3">Local Manufacturing & Supply</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 max-w-xl">
                  A localized search engine operating like a "public library" to find professional fabricators and material suppliers. Filter by "Made circular", "Bespoke", and "Ancient techniques" while highlighting stories of local family/women-owned businesses.
                </p>
                <div className="text-xs font-medium text-muted-foreground mt-auto pt-4 border-t">Powered by Make Works</div>
              </div>

            </div>
          </div>
        </section>

      </main>

      <footer className="border-t py-12 bg-card">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} Fab City OS. Infrastructure for Distributed Production.</p>
        </div>
      </footer>
    </div>
  );
}
