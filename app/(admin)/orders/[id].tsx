import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import orders from '@/assets/data/orders';
import OrderListItem from '@/components/OrderListItem';
import OrderItemListItem from '@/components/OrderItemListItem';
import { FlatList } from 'react-native';
import { OrderStatusList } from '@/assets/types';
import Colors from '@/constants/Colors';
import { useOrderDetails, useUpdateOrder } from '@/api/orders';

const OrderDetailsScreen = () => {
    const {id:idString}=useLocalSearchParams();
        const id=parseFloat(typeof idString==="string"?idString:idString[0]);
    
        const {data:order,isLoading,error}=useOrderDetails(id)

        const{mutate:updateOrder}=useUpdateOrder();

        const updateStatus=(status:any)=>{
          updateOrder({id:id,updatedFields:{status}})
        }

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
        ListFooterComponent={()=>(<>
          <Text style={{ fontWeight: 'bold' }}>Status</Text>
          <View style={{ flexDirection: 'row', gap: 5 }}>
            {OrderStatusList.map((status) => (
              <Pressable
                key={status}
                onPress={() => updateStatus(status)}
                style={{
                  borderColor: Colors.light.tint,
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 5,
                  marginVertical: 10,
                  backgroundColor:
                    order.status === status
                      ? Colors.light.tint
                      : 'transparent',
                }}
              >
                <Text
                  style={{
                    color:
                      order.status === status ? 'white' : Colors.light.tint,
                  }}
                >
                  {status}
                </Text>
              </Pressable>
            ))}
          </View>
        </>
        )}
        />
      </View>
  )
}

export default OrderDetailsScreen