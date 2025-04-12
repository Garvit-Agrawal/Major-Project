import { StyleSheet, Text, View, Image, Pressable, Button } from 'react-native';
import Colors from '@/constants/Colors';
import { Product } from '@/assets/types';
import { Link } from 'expo-router';
import { useCart } from '@/providers/Cartprovider';

export const defaultPizzaImage = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/peperoni.png';

type productListItemprops = {
  product: Product;
}

const FavListItem = ({ product }: productListItemprops) => {

  const {deleteFavItem}=useCart()  
  const deletefav=()=>{
    deleteFavItem(product)
  }

  return (
    <View style={styles.container}>
      <Link href={`/menu/${product.id}`} asChild>
      <Pressable >
        <Image source={{ uri: product.image || defaultPizzaImage }} style={styles.image}
          resizeMode='contain'
        />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </Pressable>
    </Link>
    <Button title='Delete' onPress={deletefav}/>
    </View>
  )
}

export default FavListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    flex: 1,
    maxWidth: '50%',
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    marginVertical: 10,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    aspectRatio: 1
  }
});
