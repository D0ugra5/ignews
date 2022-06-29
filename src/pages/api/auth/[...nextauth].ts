import GitHubProvider from "next-auth/providers/github";
import NextAuth from 'next-auth';


export default NextAuth({
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            authorization: {
                params: {
                    scope: 'read:user ',
                },
            }
        }),
    ],

})