import { View, Text, Platform,FlatList } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { useContext } from 'react'
import {useCart } from '@/providers/Cartprovider'
import CartListItem from '@/components/CartListItem'
import Button from '@/components/Button'

const CartScreen = () => {

  const {items,total,checkout}=useCart()

  return (
    <View style={{padding: 10}}>
      <FlatList data={items}
      renderItem={({item})=> <CartListItem cartItem={item}
      />}
      contentContainerStyle={{gap: 10}}
      />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <Text style={{marginTop:20,fontSize:20, fontWeight:'500'}}>Total: ${total.toFixed(2)}</Text>
      <Button onPress={checkout} text='Checkout'/>
    </View>

  )
}

export default CartScreen