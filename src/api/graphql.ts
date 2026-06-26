import client from "./client";

export async function gql<T = unknown>(
	query: string,
	variables?: Record<string, unknown>
): Promise<T> {
	const response = await client.post("/graphql", { query, variables });
	
	if (response.data.errors) {
		throw new Error(response.data.errors[0].message);
	}

	return response.data.data;
}