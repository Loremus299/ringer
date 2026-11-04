import e409 from "./409";

export default async function handleError(res: Response) {
	switch (res.status) {
		case 409:
			return e409(await res.text());
	}
	return res;
}
