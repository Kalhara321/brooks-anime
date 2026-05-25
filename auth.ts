import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  providers: [
    Google,
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isProfilePage = nextUrl.pathname.startsWith("/profile")
      const isAdminPage = nextUrl.pathname.startsWith("/admin")

      if (isAdminPage) {
        // For demonstration, we'll check against a hardcoded admin email
        // In a real app, this would come from a 'role' field in your database
        const isAdmin = auth?.user?.email === process.env.ADMIN_EMAIL
        return isLoggedIn && isAdmin
      }

      if (isProfilePage) {
        if (isLoggedIn) return true
        return false // Redirect to login
      }
      return true
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)