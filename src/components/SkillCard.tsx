import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Clock, Star } from "lucide-react";

interface SkillCardProps {
  title: string;
  description: string;
  category: string;
  userName: string;
  avatarUrl?: string;
  creditsPerHour: number;
  rating: number;
  onRequest?: () => void;
}

const categoryColors: Record<string, string> = {
  Tech: "bg-primary/10 text-primary",
  Arts: "bg-pink-100 text-pink-700",
  Language: "bg-amber-100 text-amber-700",
  Trade: "bg-orange-100 text-orange-700",
  Wellness: "bg-accent/10 text-accent",
};

const SkillCard = ({
  title,
  description,
  category,
  userName,
  creditsPerHour,
  rating,
  onRequest,
}: SkillCardProps) => {
  return (
    <Card className="group transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <CardHeader className="pb-3">
        <span className={`inline-block w-fit rounded-sm px-2 py-0.5 text-xs font-semibold uppercase tracking-widest ${categoryColors[category] || "bg-muted text-muted-foreground"}`}>
          {category}
        </span>
        <h3 className="font-display text-lg font-semibold text-card-foreground">{title}</h3>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-0">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-display text-xs font-bold text-primary">
            {userName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-card-foreground">{userName}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-0.5 text-amber-500">
                <Star className="h-3 w-3 fill-current" />
                {rating.toFixed(1)}
              </span>
              <span className="flex items-center gap-0.5">
                <Clock className="h-3 w-3" />
                {creditsPerHour} credit/hr
              </span>
            </div>
          </div>
        </div>
        <Button size="sm" variant="accent" onClick={onRequest}>
          Request
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SkillCard;
