export async function gql<T>(
	query: string,
	variables?: Record<string, unknown>
): Promise<T> {
    const token = localStorage.getItem("token");

	const headers: Record<string, string> = {
		"Content-Type": "application/json"
	}
	
	if (token) {
		headers.Authorization = `Bearer ${token}`
	}

	const response = await fetch("/api/graphql", {
		method: "POST",
		headers,
		body: JSON.stringify({ query, variables })
	})
	
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
        throw new Error(data.errors[0].message);
    }

    return data.data;
}