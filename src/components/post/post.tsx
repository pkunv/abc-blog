import {
  TypographyH1,
  TypographyMuted,
  TypographyP,
} from "@/components/ui/typography";
import type { RouterOutputs } from "@/trpc/react";
import type { BlogPosting, WithContext } from "schema-dts";

export default function Post({
  data,
}: {
  data: Exclude<RouterOutputs["post"]["get"], null>;
}) {
  const jsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    alternativeHeadline:
      data.title.length > 24
        ? data.title.split(" ").slice(0, 5).join(" ")
        : data.title,
    editor: data.createdBy.name,
    wordCount: data.content.split(" ").length,
    datePublished: data.createdAt.toISOString(),
    dateModified: data.updatedAt?.toISOString(),
    description: "Blog post on ABC Blog",
    articleBody: data.content,
    author: {
      "@type": "Person",
      name: data.createdBy.name,
    },
    creator: {
      "@type": "Person",
      name: data.createdBy.name,
    },
    inLanguage: "en-US",
    genre: "blog",
    articleSection: "Uncategorized",
    url: process.env.NEXTAUTH_URL + "/posts/" + data.slug,
  };

  return (
    <>
      <section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </section>
      <article className="w-full text-left">
        <TypographyH1>{data.title}</TypographyH1>
        <TypographyP>{data.content}</TypographyP>
        <TypographyMuted>{data.createdAt.toLocaleDateString()}</TypographyMuted>
      </article>
    </>
  );
}