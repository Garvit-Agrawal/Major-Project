import { View, Text, Image, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router'
import products from '@/assets/data/products'
import ProductListItem, { defaultPizzaImage } from '@/components/ProductListItem'
import Button from '@/components/Button'
import { useCart } from '@/providers/Cartprovider'
import { PizzaSize } from '@/assets/types'
import { ScrollView } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import Colors from '@/constants/Colors'
import { useProduct } from '@/api/products'

const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];

const ProductDetailScreen = () => {

  const [selectedSize, setSelectedSize] = useState<PizzaSize>('S');

  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);

  const { data: product, error, isLoading } = useProduct(id);

  const { addItem, addFavItem } = useCart();

  const router = useRouter()



  const addToCart = () => {
    if (!product) { return; }
    addItem(product, selectedSize);
    router.push('/cart')
  }

  const addToFav = () => {
    if (product) {
      addFavItem(product);
    }
  }

  if (!product) {
    return <Text>Product not found</Text>
  }

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (error) {
    return <Text>Failed to fetch products</Text>
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{
        title: "Menu",
        headerRight: () => (
          <Link href={`/(admin)/menu/create?id=${id}`} asChild>
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="pencil"
                  size={25}
                  color={Colors.light.tint}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </Link>
        ),
      }} />
      <Stack.Screen options={{ title: product?.name }} />
      <Image source={{ uri: product.image || defaultPizzaImage }} style={styles.image} />



      <Text style={styles.title}>{(product.name)}</Text>
      <Text style={styles.price}>₹{product.price}/kg</Text>

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
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  }
});