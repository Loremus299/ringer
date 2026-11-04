import { env } from "#lib/utils";
import handleError from "@/routes/errors";
import type { authSessionGetResponse } from "@ringer/schemas";
import { useQuery } from "@tanstack/react-query";

export default function Sessions() {
	const sessions = useQuery({
		queryKey: ["sessions"],
		queryFn: async () => {
			const req = await fetch(`${env.backend}/auth/session`, {
				credentials: "include",
			});

			await handleError(req);
			return (await req.json()) as typeof authSessionGetResponse._output;
		},
	});

	if (sessions.isPending) return <div>Loading....</div>;
	if (sessions.isError) return <div>Error....</div>;

	return (
		<div>
			{sessions.data.map((item) => (
				<div key={item.id}></div>
			))}
		</div>
	);
}
