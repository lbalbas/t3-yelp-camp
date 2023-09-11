import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";

export const campsRouter = createTRPCRouter({
  getReviewsOfCamp: publicProcedure
    .input(z.object({ campId: z.string() }))
    .query(async ({ ctx, input }) => {
      const reviews = await ctx.prisma.review.findMany({
        where: {
          campgroundId: input.campId,
        },
      });

      if (reviews) return reviews;

      throw new Error("Something went wrong");
    }),
  makeReviewOfCamp: privateProcedure
    .input(
      z.object({
        campgroundId: z.string(),
        rating: z.number().min(1).max(5),
        text: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.review.create({
        data: {
          rating: input.rating,
          campgroundId: input.campgroundId,
          text: input.text,
          creatorId: ctx.userId,
        },
      });
    }),
});
