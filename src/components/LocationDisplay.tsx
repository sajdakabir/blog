import { useEffect, useState } from 'react';

interface LocationData {
  success: boolean;
  location: string;
  timestamp: string;
  cached?: boolean;
}

export default function LocationDisplay() {
  const [data, setData] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLocation = async (refresh = false) => {
    try {
      const url = refresh ? '/api/location?refresh=true' : '/api/location';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch location');
      }
      const newData = await response.json();
      setData(newData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch location');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLocation(true);
  };

  if (isLoading) {
    return <div className="text-gray-500">Loading location...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex flex-col space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-red-500">📍</span>
          <span className="text-black">current: <a href={`https://www.google.com/search?q= where is ${data.location}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:underline">{data.location.toLowerCase()}</a></span>
          {data.cached && <span className="text-xs text-gray-400">(cached)</span>}
          <button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="ml-2 text-xs text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            {isRefreshing ? 'Refreshing...' : '↻'}
          </button>
        </div>
        <div className="ml-6">
          <span className="text-black">timestamp: </span>
          <span className="text-gray-500">{new Date(data.timestamp).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
