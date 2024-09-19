import { getLocalizedPathname } from "@/i18n";
import { fromJSONToPlainText } from "@/lib/plate";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { utapi } from "@/server/uploadthing";
import { postSchema } from "@/trpc/schemas";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const postInclude = {
  createdBy: true,
  files: true,
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
  getOverallStats: publicProcedure.query(async ({ ctx }) => {
    return {
      totalPosts: await ctx.db.post.count(),
      totalViews: (await ctx.db.post.aggregate({ _sum: { views: true } }))._sum
        .views,
      totalReads: (await ctx.db.post.aggregate({ _sum: { reads: true } }))._sum
        .reads,
    };
  }),
  getCategories: publicProcedure.query(async ({ ctx }) => {
    return Object.values(
      (
        await ctx.db.post.findMany({
          select: { category: true, title: true, slug: true },
          where: { active: true, placement: "DEFAULT" },
          orderBy: { createdAt: "desc" },
        })
      )
        // group by "category" property
        .reduce(
          (acc, post) => {
            if (!acc[post.category]) {
              acc[post.category] = {
                category: post.category,
                href: `${getLocalizedPathname("/categories")}/${post.category}`,
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
        placement: z
          .enum(["FEATURED", "ABOUT", "CONTACT", "DEFAULT", "ALL"])
          .default("DEFAULT"),
      }),
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db.post.findFirst({
        include: postInclude,
        where: {
          id: input.id,
          slug: input.slug,
          placement: input.placement !== "ALL" ? input.placement : undefined,
        },
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
        q: z.string().optional(),
        placement: z
          .enum(["FEATURED", "ABOUT", "CONTACT", "DEFAULT", "ALL"])
          .default("DEFAULT"),
        drafts: z.boolean().default(false),
      }),
    )
    .query(async ({ input, ctx }) => {
      return ctx.db.post.findMany({
        select: {
          id: true,
          title: true,
          contentPreview: input.contentPreview ? true : false,
          slug: true,
          category: true,
          createdAt: true,
          createdBy: true,
          reads: true,
          views: true,
        },
        where: {
          category: input.category,
          active: input.drafts ? undefined : true,
          placement: input.placement === "ALL" ? undefined : input.placement,
          OR: input.q
            ? [
                { content: { contains: input.q, mode: "insensitive" } },
                { title: { contains: input.q, mode: "insensitive" } },
              ]
            : undefined,
        },
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
        slug = `${slug}-${new Date().getTime().toString().slice(-4)}`;
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
          placement: input.placement,
          files: {
            create: input.files
              ? input.files.map((file) => {
                  return {
                    url: file.url,
                    type: file.type,
                    name: file.name,
                    altText: null,
                  };
                })
              : undefined,
          },
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
        slug = `${slug}-${new Date().getTime().toString().slice(-4)}`;
      }

      if (input.files) {
        const deleteRequest = await utapi.deleteFiles(
          input.files
            .filter((file) => file.deleted === true)
            .map((file) => file.url.split("/").pop()!),
        );

        if (
          !deleteRequest.success ||
          deleteRequest.deletedCount !==
            input.files.filter((file) => file.deleted).length
        ) {
          console.log(deleteRequest, input.files);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete files",
          });
        }

        await ctx.db.file.deleteMany({
          where: { postId: input.id },
        });
      }

      return ctx.db.post.update({
        where: { id: input.id },
        data: {
          title: input.title,
          content: input.content,
          category: input.category,
          slug,
          active: input.active,
          placement: input.placement,
          files: {
            create: input.files
              ? input.files
                  .filter((file) => !file.deleted)
                  .map((file) => {
                    return {
                      url: file.url,
                      type: file.type,
                      name: file.name,
                      altText: null,
                    };
                  })
              : undefined,
          },
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
