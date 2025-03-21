import { useState } from 'react';

const useSearchIconViewModel = (onSearch) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleSearchPress = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
    onSearch(text);
  };

  const clearSearchText = () => {
    setSearchText('');
    onSearch('');
  };

  return {
    isSearchVisible,
    searchText,
    handleSearchPress,
    handleSearchChange,
    clearSearchText,
  };
};

export default useSearchIconViewModel;