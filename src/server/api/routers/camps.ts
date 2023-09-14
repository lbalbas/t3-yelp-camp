import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  privateProcedure,
} from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import type { Campground } from "@prisma/client";

const addUserDataTocamps = async (camps: Campground[]) => {
  const userId = camps.map((campground) => campground.creatorId);
  const users = (
    await clerkClient.users.getUserList({
      userId: userId,
      limit: 110,
    })
  ).map(filterUserForClient);

  return camps.map((campground) => {
    const author = users.find((user) => user.id === campground.creatorId);

    if (!author) {
      console.error("AUTHOR NOT FOUND", campground);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Submitter for camp not found. camp ID: ${campground.id}, USER ID: ${campground.authorId}`,
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
      campground,
      author: {
        ...author,
        username: author.username ?? "(username not found)",
      },
    };
  });
};

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
      const camp = await ctx.prisma.campground.findFirst({
        where: {
          id: input.id,
        },
      });

      if (!camp) throw new TRPCError({ code: "NOT_FOUND" });

      return (await addUserDataTocamps([camp]))[0];
    }),
  search: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const search = await ctx.prisma.campground.findMany({
        where: {
          name: {
            contains: input.query,
            mode: "insensitive",
          },
        },
      });
      return search;
    }),
  create: privateProcedure
    .input(
      z.object({
        name: z.string().min(1),
        image: z.string().min(1),
        price: z.string().min(1),
        description: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, image, description, price } = input;
      return await ctx.prisma.campground.create({
        data: {
          name,
          image,
          description,
          price,
          creatorId: ctx.userId,
        },
      });
    }),
});
