import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/masuk',
  },
  callbacks: {
    async authorized() {
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        try {
          const email = credentials?.email as string
          const password = credentials?.password as string
          const expectedRole = credentials?.role as string | undefined

          if (!email || !password) return null

          const user = await prisma.user.findUnique({ where: { email } })
          if (!user) return null

          // Kalau ada filter role, cocokkan
          if (expectedRole && user.role !== expectedRole) return null

          // Khusus admin: hanya email yang diizinkan
          const ADMIN_EMAIL = 'azkafadillah1107@gmail.com'
          if (user.role === 'admin' && user.email !== ADMIN_EMAIL) return null

          const isValid = await bcrypt.compare(password, user.password)
          if (!isValid) return null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          } as any
        } catch (e) {
          console.error('[auth] authorize error:', e)
          return null
        }
      },
    }),
  ],
})
