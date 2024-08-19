import { fromJSONToPlainText } from "@/lib/plate";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { postSchema } from "@/trpc/schemas";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const postInclude = {
  createdBy: true,
};

function convertTitleToSlug(title: string) {
  const slugContent =
    title.length > 24 ? title.split(" ").slice(0, 5).join(" ") : title;
  return slugContent
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export const postRouter = createTRPCRouter({
  getCategories: publicProcedure.query(async ({ ctx }) => {
    return Object.values(
      (
        await ctx.db.post.findMany({
          select: { category: true, title: true, slug: true },
        })
      )
        // group by "category" property
        .reduce(
          (acc, post) => {
            if (!acc[post.category]) {
              acc[post.category] = {
                category: post.category,
                href: `/category/${post.category}`,
                posts: [],
              };
            }
            acc[post.category]?.posts.push(post);
            return acc;
          },
          {} as Record<
            string,
            {
              category: string;
              href: string;
              posts: { category: string; title: string; slug: string }[];
            }
          >,
        ),
    );
  }),
  get: publicProcedure
    .input(
      z.object({
        id: z.number().optional(),
        slug: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db.post.findFirst({
        include: postInclude,
        where: { id: input.id, slug: input.slug },
        orderBy: { createdAt: "desc" },
      });
    }),
  getMany: publicProcedure
    .input(
      z.object({
        orderBy: z.enum(["desc", "asc"]).default("desc"),
        category: z.string().optional(),
        take: z.number().optional(),
        contentPreview: z.boolean().default(false),
      }),
    )
    .query(async ({ input, ctx }) => {
      return ctx.db.post.findMany({
        select: {
          id: true,
          title: true,
          content: input.contentPreview ? false : true,
          contentPreview: input.contentPreview ? true : false,
          slug: true,
          category: true,
          createdAt: true,
          createdBy: true,
          reads: true,
          views: true,
        },
        where: { category: input.category },
        orderBy: { createdAt: input.orderBy },
        take: input.take,
      });
    }),
  create: protectedProcedure
    .input(postSchema)
    .mutation(async ({ input, ctx }) => {
      let slug = convertTitleToSlug(input.title);

      // check if this slug already exists
      if (await ctx.db.post.findFirst({ where: { slug } })) {
        slug = `${slug}-1`;
      }

      const category = new Date().toISOString().split("T")[0]!.slice(0, 7);

      const contentPreview = fromJSONToPlainText(input.content).slice(0, 50);

      return ctx.db.post.create({
        data: {
          title: input.title,
          content: input.content,
          contentPreview,
          slug,
          keywords: input.keywords,
          createdById: ctx.session.user.id,
          category: input.category ?? category,
        },
      });
    }),
  update: protectedProcedure
    .input(postSchema)
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.db.post.findFirst({ where: { id: input.id } });

      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      let slug = convertTitleToSlug(input.title);

      // check if this slug already exists
      if (await ctx.db.post.findFirst({ where: { slug } })) {
        slug = `${slug}-1`;
      }

      return ctx.db.post.update({
        where: { id: input.id },
        data: {
          title: input.title,
          content: input.content,
          slug,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.post.delete({ where: { id: input.id } });
    }),
  collectImpression: publicProcedure
    .input(z.object({ postId: z.number(), type: z.enum(["view", "read"]) }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.post.update({
        where: { id: input.postId },
        data:
          input.type === "view"
            ? { views: { increment: 1 } }
            : { reads: { increment: 1 } },
      });
    }),
});
