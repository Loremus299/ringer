import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { ComponentProps, useEffect, useState } from "react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../ui/hover-card";
import { cn } from "#lib/utils";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type Props = ComponentProps<"span"> & {
	date?: Date | string;
	format?: string;
	display?: ("utc" | "local" | "unix")[];
};

export function FromNowHoverCard({
	date = new Date(),
	display = ["local", "utc", "unix"],
	format = "MMM DD, YYYY, HH:mm:ss",
	className,
}: Props) {
	const [tz, setTz] = useState<string>("UTC");

	useEffect(() => {
		if (typeof window !== "undefined" && Intl?.DateTimeFormat) {
			setTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
	}, []);

	const d = dayjs(date);
	const utcString = d.utc().format(format);
	const localString = d.tz(tz).format(format);
	const timestamp = d.valueOf();

	return (
		<HoverCard>
			<HoverCardTrigger>
				<span
					className={cn(
						"p-4 pt-2 pb-2 border transition duration-300 rounded-md",
						className,
					)}
				>
					{d.fromNow()}
				</span>
			</HoverCardTrigger>
			<HoverCardContent className="text-xs tracking-wide w-fit whitespace-pre">
				<div className="flex gap-2">
					<div className="flex flex-col gap-1 text-xs tracking-wide w-fit">
						{display.map((type) => {
							if (type === "unix") {
								return (
									<div key="unix" className="flex gap-4 justify-between">
										<span>{timestamp}</span>
										<span className="text-muted-foreground">(Timestamp)</span>
									</div>
								);
							}
							if (type === "local") {
								return (
									<div key="local" className="flex gap-4 justify-between">
										<span>{localString}</span>
										<span className="text-muted-foreground">({tz})</span>
									</div>
								);
							}
							if (type === "utc") {
								return (
									<div key="utc" className="flex gap-4 justify-between">
										<span>{utcString}</span>
										<span className="text-muted-foreground">(UTC)</span>
									</div>
								);
							}
							return null;
						})}
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
