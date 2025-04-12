import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import orders from '@/assets/data/orders'
import { FlatList } from 'react-native'
import OrderListItem from '@/components/OrderListItem'
import { useAdminOrderList } from '@/api/orders'

const OrdersScreen = () => {
  const {data:orders,isLoading,error}=useAdminOrderList({archived:true})
    if (isLoading) {
      return <ActivityIndicator />;
    }
    if (error) {
      return <Text>Failed to fetch</Text>;
    }
  return (
    <FlatList data={orders} renderItem={({item})=>(
        <OrderListItem order={item}/>
    )}
    contentContainerStyle={{gap:10,padding:10}}/>
  )
}

export default OrdersScreen