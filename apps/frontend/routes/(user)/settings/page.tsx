import Container from "#components/container";
import { getCookie } from "#lib/utils";
import { Link, Navigate } from "react-router";
import Sessions from "./sessions.page";

export default function Page() {
	const cookie = getCookie("loggedIn") == "true";
	if (!cookie) return <Navigate to="/auth/login" replace />;

	return (
		<Container>
			<Sessions />
			<Link to={"/dashboard"}>Hi</Link>
		</Container>
	);
}
