"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";
	const router = useRouter();
	const [user, setUser] = useState({
		username: "",
		password: "",
	});
	const [errorMsg, setErrorMsg] = useState("");

	const onSubmit = async () => {
		const response = await signIn("flask", {
			username: user.username,
			password: user.password,
			redirect: false,
		});
		console.log(response);
		if (!response?.error) router.push(callbackUrl?.toString());
		else setErrorMsg("Invalid username or password");
	};

	return (
		<div className="border-2 border-slate-500 w-72 flex items-center flex-col p-4 rounded-lg">
			<h1 className="text-2xl font-bold p-2 mb-3">Login Page</h1>
			<div className="mb-4 w-full">
				<input
					className="border-solid border border-gray-100 rounded px-2 py-3 bg-slate-800  w-full"
					type="text"
					placeholder="Username"
					required
					onChange={(e) =>
						setUser({ ...user, username: e.target.value })
					}
				/>
			</div>
			<div className="mb-6 w-full">
				<input
					className="border-solid border border-gray-100 rounded px-2 py-3 bg-slate-800 w-full"
					type="password"
					placeholder="Password"
					required
					onChange={(e) =>
						setUser({ ...user, password: e.target.value })
					}
				/>
			</div>
			<div className="mb-4 w-full">
				<button
					type="submit"
					className="bg-blue-500 w-full p-2 hover:bg-blue-500/50"
					onClick={onSubmit}>
					Sign in
				</button>
			</div>
			{errorMsg && (
				<div className="mb-4 w-full">
					<p
						className="text-sm italic text-red-600">
						{errorMsg}
					</p>
				</div>
			)}
			<div className="mb-4 w-full">
				<p
					className="italic text-blue-500 text-sm cursor-pointer hover:underline"
					onClick={() => router.push("/signup")}>
					Not yet registered ?
				</p>
			</div>
		</div>
	);
}
