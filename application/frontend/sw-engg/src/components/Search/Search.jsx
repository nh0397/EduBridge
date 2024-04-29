import React, {useEffect, useState} from 'react';

import SearchComponent from './Search';
import apiService from '../../../services/apiService';
import Conversations from '../Landing/StudentLanding/Conversations';


const SearchComponent = ({ data }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Debounce setup (simplified)
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    useEffect(() => {
        // Fetch files when the component mounts
        const fetchFilesData = async () => {
          try {
            const filesData = await apiService.fetchFiles();
            setFiles(filesData.data);
          } catch (error) {
            console.error('Error fetching files:', error);
          }
        };
    
        fetchFilesData();
      }, []); 
    
    // Handle search input changes
    const handleSearch = debounce((searchQuery) => {
        setIsLoading(true); // Show loading state
        // Simulate a fetch delay
        setTimeout(() => {
            setQuery(searchQuery);
            setIsLoading(false);
        }, 500); // Delay for half a second
    }, 300);

    // Filter data based on query
    const filteredData = data.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));

    return (
        <div>
            <input
                type="text"
                aria-label="Search items"
                placeholder="Type to search..."
                onChange={(e) => handleSearch(e.target.value)}
            />
            {isLoading ? <div>Loading...</div> : null}
            <ul>
                {filteredData.length > 0 ? (
                    filteredData.map((item, index) => <li key={index}>{item.name}</li>)
                ) : (
                    !isLoading && <div>No results found.</div>
                )}
            </ul>
        </div>
    );
};

export default SearchComponent;
// Path: application/frontend/sw-engg/src/components/Search/Search.jsx  (end)   (start)                     