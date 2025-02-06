import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/']); // Include / as a public route

export default clerkMiddleware(async (auth, request) => {
  const authObject = await auth(); // Await the auth object

  // If it's a public route, skip protection
  if (isPublicRoute(request)) {
    return;
  }

  // If not authenticated, redirect to the sign-in page
  if (!authObject.userId) {
    return authObject.redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
