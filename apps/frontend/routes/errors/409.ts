import { toast } from "#components/ui/toast";

export default function e409(resource: string) {
	return toast.add({
		title: "409 | Resource Conflict",
		description: `${resource} already exists or can't be created.`,
	});
}
