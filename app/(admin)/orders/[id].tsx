import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import OrderListItem from '@/components/OrderListItem';
import OrderItemListItem from '@/components/OrderItemListItem';
import { FlatList } from 'react-native';
import { OrderStatusList } from '@/assets/types';
import Colors from '@/constants/Colors';
import { useOrderDetails, useUpdateOrder } from '@/api/orders';

import { useProfileDetails } from '@/api/profile/profile';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const OrderDetailsScreen = () => {
        const {id:idString}=useLocalSearchParams();
        const id=parseFloat(typeof idString==="string"?idString:idString[0]);
    
        const {data:order,isLoading,error}=useOrderDetails(id)
        const userId = order?.user_id;
        const {data:profileInformation}=useProfileDetails(userId);
        
        
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
            {profileInformation && (
      <View
        style={{
          padding: 15,
          backgroundColor: '#ffffff',
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          borderWidth: 1,
          borderColor: '#e0e0e0',
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: Colors.light.tint }}>
          Customer Information
        </Text>

        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 14, color: '#888' }}>Full Name</Text>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>{profileInformation.full_name}</Text>
        </View>

        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 14, color: '#888' }}>Phone Number</Text>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>{profileInformation.phone_number}</Text>
        </View>

        <View>
          <Text style={{ fontSize: 14, color: '#888' }}>Address</Text>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>{profileInformation.address}</Text>
        </View>
      </View>
    )}


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