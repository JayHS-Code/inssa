import {
  NextFetchEvent,
  NextRequest,
  NextResponse,
  userAgent,
} from "next/server";

export const config = {
  matcher: ["/((?!_next|api/auth).*)(.+)"],
};

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { isBot } = userAgent(req);
  if (isBot) {
    return;
  }
  if (!req.url.includes("/api")) {
    if (!req.url.includes("/account") && !req.cookies.get("inssaSession")) {
      return NextResponse.redirect(`${req.nextUrl.origin}/account/signIn`);
    }
  }
}
