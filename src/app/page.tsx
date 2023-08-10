"use client";

import { signOut, useSession } from "next-auth/react";

export default function Home() {
	const { data: session } = useSession();

	return (
		<main className="flex min-h-screen flex-col items-center justify-evenly p-24">
			<h1 className="text-2xl">Hello! {session?.user.username}</h1>
			<p className="text-lg">
				Session: <span>{JSON.stringify(session)}</span>
			</p>
			<button
				className="border rounded-md border-slate-500 p-2 bg-red-500/50"
				onClick={() => signOut()}>
				Sign Out
			</button>
		</main>
	);
}
