import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import ProductListItem from '@/components/ProductListItem';
import { useproductList } from '@/api/products';


export default function MenuScreen() {
  const { data: products, error, isLoading } = useproductList()

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (error) {
    return <Text>Failed to fetch products</Text>
  }
  return (
    <FlatList data={products}
      renderItem={({ item }) => <ProductListItem product={item} />}
      numColumns={2}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      columnWrapperStyle={{ gap: 10 }}
    />
  );
}


