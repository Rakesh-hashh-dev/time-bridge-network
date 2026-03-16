import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ExchangeTicker from "@/components/ExchangeTicker";
import { Code, Palette, Languages, Wrench, Heart, Users, ArrowRightLeft, Sparkles } from "lucide-react";

const categories = [
  { icon: Code, label: "Tech", color: "bg-primary/10 text-primary" },
  { icon: Palette, label: "Arts", color: "bg-pink-100 text-pink-700" },
  { icon: Languages, label: "Language", color: "bg-amber-100 text-amber-700" },
  { icon: Wrench, label: "Trade", color: "bg-orange-100 text-orange-700" },
  { icon: Heart, label: "Wellness", color: "bg-accent/10 text-accent" },
];

const steps = [
  { icon: Sparkles, title: "List Your Skill", description: "Share what you know — coding, cooking, carpentry, anything." },
  { icon: Users, title: "Find a Match", description: "Browse skills from your community and connect with peers." },
  { icon: ArrowRightLeft, title: "Exchange & Grow", description: "Trade time, not money. 1 hour taught = 1 credit earned." },
];

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="container flex flex-col items-center py-20 text-center md:py-32">
        <h1 className="animate-fade-in-up font-display text-5xl font-extrabold tracking-tight text-foreground md:text-7xl">
          Trade your skills.
          <br />
          <span className="text-primary">Grow together.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground" style={{ animationDelay: "0.1s", animationFillMode: "forwards", opacity: 0 }} className-extra="animate-fade-in-up">
          SkillBridge connects underemployed youth through time-banking. No money needed — just your time and talent.
        </p>
        <div className="mt-8 flex gap-3" style={{ animationDelay: "0.2s" }}>
          <Link to="/signup">
            <Button size="lg" variant="hero">Offer a Skill</Button>
          </Link>
          <Link to="/explore">
            <Button size="lg" variant="hero-outline">Learn a Skill</Button>
          </Link>
        </div>
      </section>

      {/* Ticker */}
      <ExchangeTicker />

      {/* How it Works */}
      <section className="container py-20">
        <h2 className="mb-12 text-center font-display text-3xl font-bold text-foreground">How it works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center rounded-lg border bg-card p-8 text-center shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
                <step.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-card-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="border-y bg-card py-16">
        <div className="container">
          <h2 className="mb-10 text-center font-display text-3xl font-bold text-foreground">Explore Categories</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <Link key={cat.label} to={`/explore?category=${cat.label}`} className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-transform hover:scale-105 ${cat.color}`}>
                <cat.icon className="h-5 w-5" />
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container py-16 text-center">
        <div className="flex flex-wrap justify-center gap-12">
          <div>
            <p className="font-display text-4xl font-extrabold text-primary tabular-nums">2,400+</p>
            <p className="mt-1 text-sm text-muted-foreground">Skills Listed</p>
          </div>
          <div>
            <p className="font-display text-4xl font-extrabold text-accent tabular-nums">850+</p>
            <p className="mt-1 text-sm text-muted-foreground">Exchanges Completed</p>
          </div>
          <div>
            <p className="font-display text-4xl font-extrabold text-foreground tabular-nums">1,200+</p>
            <p className="mt-1 text-sm text-muted-foreground">Active Members</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t bg-card py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © 2026 SkillBridge. Trade skills, not dollars.
        </div>
      </footer>
    </div>
  );
};

export default Index;
