import {
  TypographyH1,
  TypographyMuted,
  TypographyP,
} from "@/components/ui/typography";
import type { RouterOutputs } from "@/trpc/react";
import { format } from "date-fns";
import type { BlogPosting, WithContext } from "schema-dts";

export default function Post({
  post,
  blog,
}: {
  post: Exclude<RouterOutputs["post"]["get"], null>;
  blog: { name: string; language: string; author: string };
}) {
  const jsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    alternativeHeadline:
      post.title.length > 24
        ? post.title.split(" ").slice(0, 5).join(" ")
        : post.title,
    editor: blog.author,
    wordCount: post.content.length,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    description: `Blog post about ${post.keywords} on ${blog.name}`,
    articleBody: post.content,
    author: {
      "@type": "Person",
      name: blog.author,
    },
    creator: {
      "@type": "Person",
      name: blog.author,
    },
    inLanguage: blog.language,
    genre: "blog",
    keywords: post.keywords,
    articleSection: post.yearAndMonthCreatedAt,
    url: process.env.NEXTAUTH_URL + "/posts/" + post.slug,
  };

  return (
    <>
      <section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </section>
      <article className="flex w-full flex-col gap-2 text-left">
        <TypographyH1>{post.title}</TypographyH1>
        <TypographyP className="whitespace-pre-wrap">
          {post.content}
        </TypographyP>
        <TypographyMuted>
          {format(post.createdAt, "PP")} • {post.views} views
        </TypographyMuted>
      </article>
    </>
  );
}
