import { View, Text,Image , StyleSheet, Pressable, ActivityIndicator} from 'react-native'
import React, { useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { defaultPizzaImage } from '@/components/ProductListItem'
import Button from '@/components/Button'
import { useCart } from '@/providers/Cartprovider'
import { PizzaSize } from '@/assets/types'
import { ScrollView } from 'react-native'
import { useProduct } from '@/api/products'

const sizes:PizzaSize[]=['S','M','L','XL'];

const ProductDetailScreen = () => {

  const [selectedSize,setSelectedSize]=useState<PizzaSize>('S');

  const {id:idString}=useLocalSearchParams();
  const id=parseFloat(typeof idString==='string'?idString:idString[0]);

  const {data:product,error,isLoading}=useProduct(id);

  const {addItem,addFavItem}=useCart();

  const router=useRouter()


  const addToCart=()=>{
    if(!product){return;}
    addItem(product,selectedSize);
    router.push('/cart')
  }

  const addToFav=()=>{
    if (product) {
      addFavItem(product);
    }
  }

  if(!product){
    return <Text>Product not found</Text>
  }

   if(isLoading){
      return <ActivityIndicator/>
    }
  
    if(error)
    {
      return <Text>Failed to fetch products</Text>
    }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{title: product?.name}}/>
      <Image source={{uri: product.image || defaultPizzaImage}} style={styles.image}/>

      <Text style={styles.price}>₹{product.price}/kg</Text>
      <Button onPress={addToCart} text='Add to cart'/>
      <Button onPress={addToFav} text='Add to favourite'/>
      
    </ScrollView>
  )
}

export default ProductDetailScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 'auto',
  },

  sizes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  size: {
    backgroundColor: 'gainsboro',
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeText: {
    fontSize: 20,
    fontWeight: '500',
  },
});