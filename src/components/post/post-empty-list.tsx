import { TypographyLead } from "@/components/ui/typography";
import { Sparkles } from "lucide-react";

export function PostEmptyList() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Sparkles size={64} />
      <TypographyLead>No posts found.</TypographyLead>
    </div>
  );
}
