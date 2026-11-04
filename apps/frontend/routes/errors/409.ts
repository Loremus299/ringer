import { toast } from "#components/ui/toast";

export default function e409(resource: string) {
	return toast.add({
		title: "Resource Conflict",
		data: `${resource} already exists or can't be created.`,
	});
}
