import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import OrderListItem from '@/components/OrderListItem';
import OrderItemListItem from '@/components/OrderItemListItem';
import { FlatList } from 'react-native';
import { useOrderDetails } from '@/api/orders';

const OrderDetailsScreen = () => {
    const {id:idString}=useLocalSearchParams();
    const id=parseFloat(typeof idString==="string"?idString:idString[0]);

    const {data:order,isLoading,error}=useOrderDetails(id)
    if(!order){
        return <Text>Order not found</Text>
    }

    if (isLoading) {
      return <ActivityIndicator />;
    }
    if (error || !order) {
      return <Text>Failed to fetch</Text>;
    }
  return (
      <View style={{padding:10,gap:20,flex:1}}>
        <Stack.Screen options={{title: `Order #${id}`}}/>
        <OrderListItem order={order}/>
        <FlatList data={order.order_items} renderItem={({item})=>(
            <OrderItemListItem item={item}/>
        )}
        contentContainerStyle={{gap:10}}
        />
      </View>
  )
}

export default OrderDetailsScreen