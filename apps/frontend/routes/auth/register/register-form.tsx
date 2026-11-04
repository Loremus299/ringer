import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authUserPostBody } from "@ringer/schemas";
import FormController from "#components/badcn/formController";
import { Input } from "#components/ui/input";
import LoadingButton from "#components/badcn/loadingButton";
import { UserPlus } from "lucide-react";
import handleError from "@/routes/errors";
import { useNavigate } from "react-router";

export default function RegisterForm() {
	const navigate = useNavigate();
	const form = useForm({
		resolver: zodResolver(authUserPostBody),
		defaultValues: { name: "", email: "", password: "" },
	});

	const onSubmit = async (values: typeof authUserPostBody._output) => {
		const req = await fetch("http://localhost:8080/auth/user", {
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
		<form
			className="grid gap-2 w-sm portrait:w-full"
			onSubmit={form.handleSubmit(onSubmit)}
		>
			<FormController
				form={form}
				name="name"
				label="Preferred Name"
				render={({ field, fieldState }) => (
					<Input
						{...field}
						id={field.name}
						aria-invalid={fieldState.invalid}
						autoComplete="name"
						placeholder="Charlotte of Troy"
					/>
				)}
			/>
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
					<Input
						{...field}
						id={field.name}
						aria-invalid={fieldState.invalid}
						autoComplete="newPassword"
						placeholder="our little secret ;3"
					/>
				)}
			/>
			<LoadingButton
				loading={form.formState.isSubmitting}
				className={"text-background"}
				type="submit"
			>
				<UserPlus /> sudo adduser
			</LoadingButton>
		</form>
	);
}
