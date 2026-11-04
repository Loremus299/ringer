import e404 from "./404";
import e409 from "./409";
import e500 from "./500";

export default async function handleError(res: Response) {
	switch (res.status) {
		case 404:
			return e404(await res.text());
		case 409:
			return e409(await res.text());
		case 500:
			return e500(res.headers.get("X-Request-Id") ?? "No Request ID");
	}
	return res;
}
