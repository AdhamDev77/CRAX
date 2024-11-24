// // middleware.ts
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// // Configure which paths to match
// export const config = {
//   matcher: [
//     // Match all paths starting with /[locale]/site/
//     '/:locale/site/:path*',
//     // Match all subdomains
//     '/:path*.localhost:3000',
//   ],
// }

// export function middleware(request: NextRequest) {
//   const url = request.nextUrl
//   const hostname = request.headers.get('host') || ''
  
//   // Case 1: Handling /[locale]/site/[path] -> [path].mydomain.com
//   if (url.pathname.startsWith('/')) {
//     const pathSegments = url.pathname.split('/')
//     if (pathSegments.length >= 4 && pathSegments[2] === 'site') {
//       const locale = pathSegments[1]
//       const path = pathSegments[3]
      
//       // Create the new subdomain URL
//       const newUrl = new URL(url)
//       newUrl.host = `${path}.localhost:3000`
      
//       // Preserve the locale in a cookie or query parameter if needed
//       const response = NextResponse.redirect(newUrl)
//       response.cookies.set('locale', locale)
      
//       return response
//     }
//   }
  
//   // Case 2: Handling direct subdomain access ([path].mydomain.com)
//   if (hostname.includes('.localhost:3000')) {
//     const subdomain = hostname.split('.')[0]
    
//     // Get the locale from cookie or default to 'en'
//     const locale = request.cookies.get('locale')?.value || 'en'
    
//     // Rewrite the request internally to your page component
//     // but keep the subdomain URL visible to the user
//     url.pathname = ``
    
//     return NextResponse.rewrite(url)
//   }
  
//   return NextResponse.next()
// }

import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ar'],
  
  // Used when no locale matches
  defaultLocale: 'en',
  localePrefix: 'always'
  
  // Optional: Specify domains with different locales
  // domains: [
  //   {
  //     domain: 'example.com',
  //     defaultLocale: 'en'
  //   },
  //   {
  //     domain: 'example.fr',
  //     defaultLocale: 'fr'
  //   }
  // ]
});
 
export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
  matcher: ['/', '/(ar|en)/:path*']
};