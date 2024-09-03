import { NextResponse } from "next/server";
import { Session } from "next-auth";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

export { default } from "next-auth/middleware"

// const res = NextResponse.next();
// export default withAuth(
//   function middleware(req: NextRequestWithAuth) {
//     const session = req.nextauth.token as unknown as Session;

//     console.log("====================================");
//     console.log(session);
//     console.log("====================================");

//     const currentPath = new URL(req.url).pathname;
//     if (session) {
   
//     }
//     return res;
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//   }
// );

export const config = { matcher: [ "/dashboard/:path*"] };
