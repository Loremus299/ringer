import { createBrowserRouter } from "react-router";
import Root from "./routes/page";
import { RouterProvider } from "react-router/dom";

const router = createBrowserRouter([{ path: "/", element: <Root /> }]);

export default function App() {
	return <RouterProvider router={router} />;
}
