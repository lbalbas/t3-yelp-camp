import { createTRPCRouter } from "~/server/api/trpc";
import { campsRouter } from "./routers/camps";
import { reviewsRouter } from "./routers/reviews"
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  camps: campsRouter,
  reviews: reviewsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
