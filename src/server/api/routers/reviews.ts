import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import type { Review } from "@prisma/client";

const addUserDataToReviews = async (reviews: Review[]) => {
  const userId = reviews.map((review) => review.creatorId);
  const users = (
    await clerkClient.users.getUserList({
      userId: userId,
      limit: 110,
    })
  ).map(filterUserForClient);

  return reviews.map((review) => {
    const author = users.find((user) => user.id === review.creatorId);

    if (!author) {
      console.error("AUTHOR NOT FOUND", review);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for review not found. review ID: ${review.id}, USER ID: ${review.authorId}`,
      });
    }
    if (!author.username) {
      // user the ExternalUsername
      if (!author.externalUsername) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Author has no GitHub Account: ${author.id}`,
        });
      }
      author.username = author.externalUsername;
    }
    return {
      review,
      author: {
        ...author,
        username: author.username ?? "(username not found)",
      },
    };
  });
};

export const reviewsRouter = createTRPCRouter({
  getReviews: publicProcedure
    .input(z.object({ campId: z.string() }))
    .query(async ({ ctx, input }) => {
      const reviews = await ctx.prisma.review.findMany({
        where: {
          campgroundId: input.campId,
        },
      });

      return addUserDataToReviews(reviews);
    }),
  createReview: privateProcedure
    .input(
      z.object({
        campgroundId: z.string(),
        rating: z.number().min(1).max(5),
        text: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.findFirst({
        where: {
          creatorId: ctx.userId,
          campgroundId: input.campgroundId,
        },
      });

      if (review)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `Author already left a review on this camp.`,
        });

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
