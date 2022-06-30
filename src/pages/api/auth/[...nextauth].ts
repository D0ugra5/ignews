import { query as q } from "faunadb";

import GitHubProvider from "next-auth/providers/github";
import NextAuth from "next-auth";
import { fauna } from "../../../services/fauna";
export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: "read:user ",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      let { email } = user;
      email = email || "";
      console.log(email);
      try {
        await fauna
          .query(
            q.If(
              q.Not(
                q.Exists(
                  q.Match(
                    q.Index("users_by_email"),
                    q.Casefold(user.email || "")
                  )
                )
              ),
              q.Create(q.Collection("users"), {
                data: { email: user.email || "" },
              }),
              q.Get(
                q.Match(q.Index("users_by_email"), q.Casefold(user.email || ""))
              )
            )
          );
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },

  secret: process.env.SECRET_KEY,
});
