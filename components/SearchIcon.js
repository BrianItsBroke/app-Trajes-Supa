import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import useSearchIconViewModel from '../viewmodels/SearchIconViewModel';

const SearchIcon = ({ onSearch }) => {
  const {
    isSearchVisible,
    searchText,
    handleSearchPress,
    handleSearchChange,
    clearSearchText,
  } = useSearchIconViewModel(onSearch);

  return (
    <View>
      <TouchableOpacity onPress={handleSearchPress}>
        <Image source={require('../assets/search.png')} style={styles.icon} />
      </TouchableOpacity>

      {isSearchVisible && (
        <View style={styles.searchBar}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar productos..."
              value={searchText}
              onChangeText={handleSearchChange}
            />
            <TouchableOpacity onPress={clearSearchText} style={styles.clearButton}>
              <Image source={require('../assets/close.png')} style={styles.clearIcon} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  searchBar: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    position: 'absolute',
    top: 35,
    left: -310,
    right: -48,
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  clearButton: {
    padding: 5,
  },
  clearIcon: {
    width: 20,
    height: 20,
  },
});

export default SearchIcon;