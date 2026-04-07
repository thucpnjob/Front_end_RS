// src/lib/recommendationService.ts
const PYTHON_API_URL = 'http://127.0.0.1:8001';

export const recommendationAPI = {
    getRecommendations: async (userId: number = 1, n: number = 12): Promise<number[]> => {
        try {
            const response = await fetch(`${PYTHON_API_URL}/recommend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, n_recommend: n }),
            });

            if (!response.ok) throw new Error('Failed to fetch recommendations');

            const data = await response.json();
            return data.success && Array.isArray(data.recommendations)
                ? data.recommendations
                : [];
        } catch (error) {
            console.error('Error calling Python recommendation API:', error);
            return [];
        }
    },
};