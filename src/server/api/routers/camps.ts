import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";

export const campsRouter = createTRPCRouter({
  getFeatured: publicProcedure.query(async ({ ctx }) => {
    const camps = await ctx.prisma.campground.findMany({
      take: 6,
    });

    if (camps) return camps;

    throw new Error("Something went wrong");
  }),
  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.campground.findFirst({
        where: {
          id: input.id,
        },
      });
    }),
  search: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.campground.findMany({
        where: {
          name: {
            contains: input.query,
          },
        },
      });
    }),
});
