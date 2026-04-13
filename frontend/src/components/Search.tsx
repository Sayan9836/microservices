import React, { useEffect, useState } from 'react'
import { useDebounce } from '../hooks/useDebounce';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }

  useEffect(() => {
    if (debouncedSearchTerm) {
        // make API call or perform search
        console.log('Searching for:', debouncedSearchTerm);
    }
  },[debouncedSearchTerm])
  return (
    <div>
      <input type="text" placeholder="Search..."  onChange={handleSearch} className='border border-black-200 outline-0 p-2 w-[30vw]'/>
    </div>
  )
}

export default Search
