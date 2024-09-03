import { TypographyLead } from "@/components/ui/typography";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export function PostEmptyList() {
  const t = useTranslations("empty");
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Sparkles size={64} />
      <TypographyLead>{t("noPostsFound")}</TypographyLead>
    </div>
  );
}
