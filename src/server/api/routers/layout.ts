import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const layoutRouter = createTRPCRouter({
  getEnabledSpecialPages: publicProcedure.query(async ({ ctx }) => {
    return {
      about: await ctx.db.post
        .findFirst({
          select: { id: true },
          where: { placement: "ABOUT" },
        })
        .then((post) => post !== null),
      contact: await ctx.db.post
        .findFirst({
          select: { id: true },
          where: { placement: "CONTACT" },
        })
        .then((post) => post !== null),
    };
  }),
});
