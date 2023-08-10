import NextAuth, { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
	providers: [
		{
			id: "flask",
			name: "Flask",
			type: "credentials",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, req) {
				const res = await fetch(
					`${process.env.SERVER_API_HOST}/login`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							username: credentials?.username,
							password: credentials?.password,
						}),
					}
				);
				if (!res.ok) return null;
				const user = await res.json();
				return user;
			},
		},
	],
	session: {
		strategy: "jwt",
	},
	secret: process.env.AUTH_SECRET,
	pages: {
		signIn: "/login",
		newUser: "/signup",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				return {
					...token,
					username: user.username,
					token: user.token,
				};
			}
			return token;
		},
		async session({ session, token }) {
			return {
				...session,
				user: {
					...session.user,
					username: token.username,
					token: token.token,
				},
			};
		},
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
