import type { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
	return (
		<div className="w-screen min-h-screen flex justify-center dark">
			<main className="w-full max-w-6xl border-l border-r">{children}</main>
		</div>
	);
}
