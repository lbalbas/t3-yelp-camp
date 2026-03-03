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
        message: `Submitter for camp not found. camp ID: ${campground.id}, USER ID: ${campground.creatorId}`,
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
  getTopRated: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.campground.findMany({
      orderBy: { averageRating: "desc" },
      take: 3,
    });
  }),
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        sort: z.enum(["newest", "topRated"]).nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 9;
      const { cursor, sort } = input;

      const items = await ctx.prisma.campground.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy:
          sort === "topRated"
            ? [{ averageRating: "desc" }, { id: "desc" }]
            : { id: "desc" },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
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
        price: z.string().min(2),
        description: z.string().min(20).max(300),
        location: z.string().min(2),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, image, description, price, location } = input;

      // Geocoding with OpenStreetMap Nominatim
      let lat = null;
      let lng = null;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            location
          )}&format=json&limit=1`
        );
        const data = await res.json();
        if (data && data.length > 0) {
          lat = parseFloat(data[0].lat);
          lng = parseFloat(data[0].lon); // Nominatim returns 'lon' instead of 'lng'
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }

      return await ctx.prisma.campground.create({
        data: {
          name,
          image,
          description,
          price,
          location,
          lat,
          lng,
          averageRating: 0,
          creatorId: ctx.userId,
        },
      });
    }),
  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        image: z.string().min(1),
        price: z.string().min(2),
        description: z.string().min(20).max(300),
        location: z.string().min(2),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const camp = await ctx.prisma.campground.findUnique({
        where: { id: input.id },
      });

      if (!camp || camp.creatorId !== ctx.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const { name, image, description, price, location } = input;

      // Geocoding with OpenStreetMap Nominatim
      let lat = camp.lat;
      let lng = camp.lng;
      if (location !== camp.location) {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
              location
            )}&format=json&limit=1`
          );
          const data = await res.json();
          if (data && data.length > 0) {
            lat = parseFloat(data[0].lat);
            lng = parseFloat(data[0].lon);
          }
        } catch (error) {
          console.error("Geocoding error:", error);
        }
      }

      return await ctx.prisma.campground.update({
        where: { id: input.id },
        data: {
          name,
          image,
          description,
          price,
          location,
          lat,
          lng,
        },
      });
    }),
  delete: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const camp = await ctx.prisma.campground.findUnique({
        where: { id: input.id },
      });

      if (!camp || camp.creatorId !== ctx.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      // Delete associated reviews
      await ctx.prisma.review.deleteMany({
        where: { campgroundId: input.id },
      });

      return await ctx.prisma.campground.delete({
        where: { id: input.id },
      });
    }),
});
