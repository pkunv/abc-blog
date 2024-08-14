import {
  TypographyH1,
  TypographyMuted,
  TypographyP,
} from "@/components/ui/typography";
import type { RouterOutputs } from "@/trpc/react";

export default function Post({
  data,
}: {
  data: Exclude<RouterOutputs["post"]["get"], null>;
}) {
  return (
    <div className="w-full text-left">
      <TypographyH1>{data.title}</TypographyH1>
      <TypographyP>{data.content}</TypographyP>
      <TypographyMuted>{data.createdAt.toLocaleDateString()}</TypographyMuted>
    </div>
  );
}
