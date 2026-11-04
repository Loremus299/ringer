import { toast } from "#components/ui/toast";

export default function e404(resource: string) {
	return toast.add({
		title: "404 | Resource Not Found",
		description: `${resource} not found.`,
	});
}
