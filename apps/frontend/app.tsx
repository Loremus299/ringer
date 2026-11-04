import { createBrowserRouter, Link, Outlet } from "react-router";
import Root from "./routes/page";
import { RouterProvider } from "react-router/dom";
import { useState } from "react";
import { cn } from "#lib/utils";
import { Button } from "#components/ui/button";
import { Eye } from "lucide-react";

const routes = [{ path: "/", element: <Root /> }];
const router = createBrowserRouter(routes);

export default function App() {
	const [routeDisplay, setRouteDisplay] = useState(true);

	return (
		<>
			<RouterProvider router={router} />
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
		</>
	);
}
