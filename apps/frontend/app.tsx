import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { useState } from "react";
import { cn } from "#lib/utils";
import { Button } from "#components/ui/button";
import { Eye } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Root from "./routes/page";
import { Toaster } from "#components/ui/toast";
import AuthRegister from "./routes/auth/register/page";
import AuthLogin from "./routes/auth/login/page";

const routes = [
	{ path: "/", element: <Root /> },
	{ path: "/auth/register", element: <AuthRegister /> },
	{ path: "/auth/login", element: <AuthLogin /> },
];
const router = createBrowserRouter(routes);
const queryClient = new QueryClient();

export default function App() {
	const [routeDisplay, setRouteDisplay] = useState(false);

	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<Toaster />
			<Button
				className={"absolute top-1 right-1"}
				onClick={() => setRouteDisplay(!routeDisplay)}
			>
				<Eye />
			</Button>
			<div
				className={cn(
					`absolute bottom-0 w-screen bg-foreground text-background p-2 gap-2`,
					routeDisplay ? "grid" : "hidden",
				)}
			>
				{routes.map((item) => (
					<a key={item.path} href={item.path}>
						{item.path}
					</a>
				))}
			</div>
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
}
