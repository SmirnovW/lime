export async function apiProvider(url, parameters = {}): Promise<Response> {
	const token = window.localStorage.getItem('token');
	const query = new URLSearchParams(parameters);

	return await fetch(`${url}?${query.toString()}`, {
		headers: new Headers({
			Authorization: `Bearer ${token}`,
		}),
	});
}
