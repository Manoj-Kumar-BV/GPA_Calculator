import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise, { getDatabase } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const db = await getDatabase()
          const users = db.collection('users')
          
          const user = await users.findOne({ email: credentials.email.toLowerCase() })
          
          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          
          if (!isPasswordValid) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string
      }
      return session
    },
    async signIn({ user, account: _account, profile: _profile }) {
      // Ensure user has studentData when signing in with OAuth
      if (_account?.provider !== 'credentials') {
        try {
          const db = await getDatabase()
          const users = db.collection('users')
          
          await users.updateOne(
            { email: user.email },
            {
              $setOnInsert: {
                studentData: {
                  cgpa: null,
                  semesters: [],
                  sgpaHistory: []
                }
              }
            },
            { upsert: true }
          )
        } catch (error) {
          console.error('Error initializing user data:', error)
        }
      }
      return true
    }
  }
})

export { handler as GET, handler as POST }
