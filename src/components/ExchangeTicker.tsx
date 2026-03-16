import { ArrowLeftRight } from "lucide-react";

const exchanges = [
  { from: "Amina", fromSkill: "Web Design", to: "Leo", toSkill: "Carpentry", time: "2 hours ago" },
  { from: "Sarah", fromSkill: "Python Basics", to: "Marcus", toSkill: "Logo Design", time: "4 hours ago" },
  { from: "Elena", fromSkill: "French Lessons", to: "David", toSkill: "Plumbing Tips", time: "6 hours ago" },
  { from: "James", fromSkill: "Video Editing", to: "Chloe", toSkill: "Yoga Session", time: "8 hours ago" },
  { from: "Kai", fromSkill: "Guitar Lessons", to: "Nina", toSkill: "Cooking Class", time: "12 hours ago" },
];

const ExchangeTicker = () => {
  return (
    <div className="overflow-hidden border-y bg-card py-3">
      <div className="flex animate-ticker-scroll gap-8">
        {[...exchanges, ...exchanges].map((ex, i) => (
          <div key={i} className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{ex.from}</span>
            <span className="text-xs">({ex.fromSkill})</span>
            <ArrowLeftRight className="h-3.5 w-3.5 text-accent" />
            <span className="font-medium text-foreground">{ex.to}</span>
            <span className="text-xs">({ex.toSkill})</span>
            <span className="text-xs text-muted-foreground">· {ex.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExchangeTicker;
