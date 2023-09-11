import { createTRPCRouter } from "~/server/api/trpc";
import { campsRouter } from "./routers/camps";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  camps: campsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
