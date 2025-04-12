import { View, Text, FlatList, Platform } from 'react-native'
import React from 'react'
import { useCart } from '@/providers/Cartprovider'
import CartListItem from '@/components/CartListItem';
import { StatusBar } from 'expo-status-bar';
import Button from '@/components/Button';
import FavListItem from '@/components/FavListItem';
import { Product } from '@/assets/types';
import ProductListItem from '@/components/ProductListItem';

const fav = () => {
    const {favItems}=useCart();
  return (
    <FlatList data={favItems}
      renderItem={({item})=> <FavListItem product={item}/>}
      numColumns={2}
      contentContainerStyle={{gap: 10, padding: 10}}
      columnWrapperStyle={{gap: 10}}
      />
  )
}

export default fav