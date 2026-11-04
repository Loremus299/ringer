import FormController from "#components/badcn/formController";
import LoadingButton from "#components/badcn/loadingButton";
import Container from "#components/container";
import { Button } from "#components/ui/button";
import { Input } from "#components/ui/input";
import { env, getCookie } from "#lib/utils";
import handleError from "@/routes/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSessionPostBody } from "@ringer/schemas";
import { Eye, EyeClosed, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router";

export default function Page() {
	const cookie = getCookie("loggedIn") == "true";
	if (cookie) return <Navigate to="/dashboard" replace />;

	const [password, setPassword] = useState(true);
	const navigate = useNavigate();
	const form = useForm({
		resolver: zodResolver(authSessionPostBody),
		defaultValues: { email: "", password: "" },
	});

	const onSubmit = async (values: typeof authSessionPostBody._output) => {
		const req = await fetch(`${env.backend}/auth/session`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});

		await handleError(req);
		if (req.ok) return navigate("/", { replace: true });
	};

	return (
		<Container>
			<div className="grid min-h-screen place-items-center">
				<form
					className="grid gap-2 w-sm portrait:w-full"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FormController
						form={form}
						name="email"
						label="Email Address"
						render={({ field, fieldState }) => (
							<Input
								{...field}
								id={field.name}
								aria-invalid={fieldState.invalid}
								type="email"
								autoComplete="email"
								placeholder="charlotte@troy.greece"
							/>
						)}
					/>
					<FormController
						form={form}
						name="password"
						label="Password"
						render={({ field, fieldState }) => (
							<div className="flex gap-2">
								<Input
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
									type={password ? "password" : "text"}
									autoComplete="currentPassword"
									placeholder="our little secret ;3"
								/>
								<Button
									variant={"outline"}
									onClick={() => setPassword(!password)}
								>
									{password ? <Eye /> : <EyeClosed />}
								</Button>
							</div>
						)}
					/>
					<LoadingButton
						loading={form.formState.isSubmitting}
						className={"text-background"}
						type="submit"
					>
						<User /> su -
					</LoadingButton>
				</form>
			</div>
		</Container>
	);
}
