import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import apiService from '../../services/apiService';

function useQuery() {
    const { search } = useLocation();
    return new URLSearchParams(search);
}

const SearchResultsPage = () => {
    const query = useQuery();
    const searchTerm = query.get('search');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            if (!searchTerm) {
                setError('No search term provided');
                return;
            }

            setLoading(true);
            setError('');
            try {
                const data = await apiService.fetchSearchedFiles(searchTerm);
                console.log("API Response:", data);  // Ensure you can see what the actual response is
                if (data && Array.isArray(data.data)) {
                    setResults(data.data);
                } else {
                    setError('Data format is incorrect, expected an array inside the data property.');
                    console.error('Incorrect data format:', data);
                }
            } catch (error) {
                console.error('Failed to fetch search results:', error);
                setError('Failed to fetch search results');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [searchTerm]);

    return (
        <div>
            <h1>Search Results for: {decodeURIComponent(searchTerm)}</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <ul>
                    {results.length > 0 ? (
                        results.map((item, index) => (
                            <li key={index}>{item.name || 'Detail not available'}</li> // Handle missing details
                        ))
                    ) : (
                        <p>No results found.</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchResultsPage;



