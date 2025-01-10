import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';

const SearchIcon = ({ onSearch, isSearchVisible, setIsSearchVisible, searchText, setSearchText }) => {
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
  // ... tus estilos existentes ...
  icon: {
    width: 30,
    height: 30,
    marginRight:15
  },
  searchBar: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    position: 'absolute',
    top: 35, // Ajusta la posición según tu header
    left: -350,
    right: -2,
    zIndex: 1, // Asegúrate de que esté por encima del contenido
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