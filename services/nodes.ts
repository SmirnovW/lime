import { API_URL, NODES_URL } from 'constants/api';
import { apiProvider } from 'services/provider';
import { NodeItemResponse } from 'services/types';

export async function fetchNodes(): Promise<{
	nodes: NodeItemResponse[];
} | null> {
	try {
		const response = await apiProvider(`${API_URL}${NODES_URL}`);
		const data = await response.json();

		return { nodes: data.nodes };
	} catch (error) {
		console.error(error);
		return null;
	}
}
