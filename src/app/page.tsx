'use client';

import { useState } from 'react';
import { fetchNeuronWriterData } from '@/util/api-helpers';
import { ApiResponse } from '@/types/neuronwriter';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchNeuronWriterData();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">NeuronWriter Data Fetcher</h1>
        <button
          onClick={handleFetchData}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Fetching...' : 'Fetch and Save Data'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 rounded">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
