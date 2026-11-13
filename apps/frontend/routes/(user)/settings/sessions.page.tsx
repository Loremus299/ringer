import { FromNowHoverCard } from "#components/badcn/fromNowHoverCard";
import LoadingButton from "#components/badcn/loadingButton";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#components/ui/card";
import { env } from "#lib/utils";
import handleError from "@/routes/errors";
import type { authSessionGetResponse } from "@ringer/schemas";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";

function getOS(ua: string) {
	if (/Windows NT 10\.0/.test(ua)) return "Windows 10/11";
	if (/Windows NT 6\.3/.test(ua)) return "Windows 8.1";
	if (/Windows NT 6\.2/.test(ua)) return "Windows 8";
	if (/Windows NT 6\.1/.test(ua)) return "Windows 7";
	if (/Mac OS X/.test(ua) && /iPhone|iPad|iPod/.test(ua)) return "iOS/iPadOS";
	if (/Mac OS X/.test(ua)) return "macOS";
	if (/Android/.test(ua)) return "Android";
	if (/Linux/.test(ua)) return "Linux";
	return "Unknown";
}

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
		<div className="grid gap-4">
			{sessions.data.map((item) => (
				<Card key={item.id}>
					<CardHeader>
						<CardTitle className="flex gap-2 items-center">
							{getOS(item.userAgent)}{" "}
							{item.current ? (
								<div className="text-sm border rounded p-2 pt-0.5 pb-0.5 bg-accent-foreground text-background">
									Current
								</div>
							) : (
								""
							)}
						</CardTitle>
						<CardDescription>{item.userAgent}</CardDescription>
						<CardAction>
							<LoadingButton size={"icon-xs"} variant={"outline"}>
								<X />
							</LoadingButton>
						</CardAction>
					</CardHeader>
					<CardContent className="mt-4 flex gap-2">
						Created <FromNowHoverCard date={item.createdAt} />, expiration
						<FromNowHoverCard date={item.expiration} />
					</CardContent>
				</Card>
			))}
		</div>
	);
}
