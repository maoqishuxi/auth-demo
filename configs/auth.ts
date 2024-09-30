import { AuthOptions } from "next-auth";
import { Provider } from "next-auth/providers/index";
import CredentialsProvider from "next-auth/providers/credentials";
import { generateHash } from "@/utils/hash";
import { compare } from "bcrypt";

const providers: Provider[] = [
  CredentialsProvider({
    name: "Weibo",
    credentials: {
      username: { label: "用户名", type: "text" },
      password: { label: "密码", type: "password" },
    },
    async authorize(credentials, req) {
      if (!credentials?.username || !credentials?.password) {
        throw new Error("empty username or password");
      }

      const user = { id: "1", name: "test", password: "test" };

      const hashedPassword = await generateHash(user.password);

      const isPasswordValid = await compare(
        credentials.password,
        hashedPassword
      );

      if (!isPasswordValid) {
        throw new Error("invalid password");
      }

      return {
        id: "1",
        name: user.name,
      };
    },
  }),
];

export const authOptions: AuthOptions = {
  providers: providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, token }) {
      if (token && token.user) {
        session.user = token.user;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
};
