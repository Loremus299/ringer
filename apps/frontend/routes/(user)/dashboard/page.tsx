import Container from "#components/container";
import { getCookie } from "#lib/utils";
import { Link, Navigate } from "react-router";

export default function Page() {
	const cookie = getCookie("loggedIn") == "true";
	if (!cookie) return <Navigate to="/auth/login" replace />;

	return (
		<Container>
			<div className="p-4">Dashboard</div>
			<Link to={"/settings"}>Hi</Link>
		</Container>
	);
}
