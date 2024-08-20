import { CollectImpression } from "@/components/post/collect-impression";
import { TypographyH1, TypographyMuted } from "@/components/ui/typography";
import { blogProps } from "@/lib/getBlogProps";
import {
  fromJSONToPlainText,
  fromJSONToPlate,
  SerializedPlateElement,
} from "@/lib/plate";
import type { RouterOutputs } from "@/trpc/react";
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
    wordCount: fromJSONToPlainText(post.content).length,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    description: `Blog post about ${post.keywords} on ${blog.name}`,
    articleBody: fromJSONToPlainText(post.content),
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
    articleSection: post.category,
    url: process.env.NEXTAUTH_URL + "/posts/" + post.slug,
  };

  return (
    <>
      <section>
        <CollectImpression postId={post.id} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </section>
      <article className="w-full space-y-2 text-left">
        <TypographyH1 className="mb-4">{post.title}</TypographyH1>
        {fromJSONToPlate(post.content)?.map((node, index) => (
          <SerializedPlateElement node={node} key={index} />
        ))}
        {post.placement === "DEFAULT" && (
          <TypographyMuted className="mt-4">
            {post.createdAt.toLocaleDateString(blogProps.language, {
              day: "numeric",
              weekday: "long",
              month: "long",
              year: "numeric",
            })}{" "}
            • {post.views} views
          </TypographyMuted>
        )}
      </article>
    </>
  );
}
