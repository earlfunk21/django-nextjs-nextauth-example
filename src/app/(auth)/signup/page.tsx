"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
	const [errorMsg, setErrorMsg] = useState("");
	const router = useRouter();
	const [newUser, setNewUser] = useState({
		username: "",
		password: "",
		confirmPassword: "",
	});

	const onSubmit = async () => {
		if (newUser.confirmPassword !== newUser.password) {
			setErrorMsg("Password not match");
		} else {
			const response = await fetch(`http://127.0.0.1:8000/signup`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: newUser.username,
					password: newUser.password,
				}),
			});
			const data = await response.json();
			if (response.ok) {
				return router.push("/login");
			}
			setErrorMsg(data.message);
		}
	};

	return (
		<div className="border-2 border-slate-500 w-72 flex items-center flex-col p-4 rounded-lg">
			<h1 className="text-2xl font-bold p-2 mb-3">Sign Up Page</h1>
			<div className="mb-6 w-full">
				<input
					className="border-solid border border-gray-100 rounded px-2 py-3 bg-slate-800  w-full"
					type="text"
					placeholder="Username"
					required
					onChange={(e) =>
						setNewUser({ ...newUser, username: e.target.value })
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
						setNewUser({ ...newUser, password: e.target.value })
					}
				/>
			</div>

			<div className="mb-6 w-full">
				<input
					className="border-solid border border-gray-100 rounded px-2 py-3 bg-slate-800 w-full"
					type="password"
					placeholder="Confirm Password"
					required
					onChange={(e) =>
						setNewUser({
							...newUser,
							confirmPassword: e.target.value,
						})
					}
				/>
			</div>

			<div className="mb-4 w-full">
				<button
					type="submit"
					className="bg-blue-500 w-full p-2 hover:bg-blue-500/50"
					onClick={onSubmit}>
					Sign up
				</button>
			</div>
			{errorMsg && (
				<div className="mb-4 w-full">
					<p className="text-sm italic text-red-600">{errorMsg}</p>
				</div>
			)}
			<div className="mb-4 w-full">
				<p
					className="italic text-blue-500 text-sm cursor-pointer hover:underline"
					onClick={() => router.push("/login")}>
					Already have an account ?
				</p>
			</div>
		</div>
	);
}
