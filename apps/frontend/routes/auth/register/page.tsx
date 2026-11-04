import Container from "#components/container";
import { getCookie } from "#lib/utils";
import { Navigate } from "react-router";
import RegisterForm from "./register-form";

export default function Page() {
	const cookie = getCookie("loggedIn") == "true";
	if (cookie) return <Navigate to="/dashboard" replace />;

	return (
		<Container>
			<div className="grid grid-cols-2 portrait:grid-cols-1">
				<div className="border-r min-h-screen p-4 portrait:hidden">
					Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quasi maxime
					necessitatibus quidem magni sint voluptas suscipit quos laborum
					recusandae blanditiis error quas illum, minus quibusdam eligendi, aut
					earum! Deserunt, soluta.
				</div>
				<div className="p-4 grid place-items-center min-h-screen">
					<RegisterForm />
				</div>
			</div>
		</Container>
	);
}
