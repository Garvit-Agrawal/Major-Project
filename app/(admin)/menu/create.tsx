import { View, Text, StyleSheet, TextInput, Image, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import Button from '@/components/Button';
import { defaultPizzaImage } from '@/components/ProductListItem';
import Colors from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Formik } from 'formik';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';
import { useDeleteProduct, useInsertProduct, useProduct, useUpdateProduct } from '@/api/products';

const CreateProductScreen = () => {
    const [image, setImage] = useState<any>(null);
    const [name, setName] = useState<any>(null);
    const [price, set] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    
    const { id:idString } = useLocalSearchParams();
    const id = parseFloat(
        typeof idString === 'string' ? idString : idString?.[0]
      );

    const isUpdating = !!idString;


    const router = useRouter();
    const { data, error, isLoading } = useProduct(id)
    const { mutate: insertProduct } = useInsertProduct();
    const { mutate: updateProduct } = useUpdateProduct();
    const { mutate: deleteProduct } = useDeleteProduct();


    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'images',
          allowsEditing: true,
          quality: 1,
          base64: true, // 👈 Add this if you want base64
        });
    
        if (!result.canceled) {
          const pickedImage = result.assets[0];
          setImage(pickedImage.uri); // or use pickedImage.base64 for base64
        }
      };

    const validateInput = (values: any) => {
        let errors: any = {};
        if (!values.name) {
            errors.name = 'Name is required';
        }
        if (!values.price) {
            errors.price = 'Price is required';
        } else if (isNaN(parseFloat(values.price))) {
            errors.price = 'Price must be a number';
        }
        return errors;
    };


    const handleSubmit = (values: any, { resetForm }: any) => {
        if (isUpdating) {
            Toast.show({
                type: 'success',
                text1: 'Product Updated',
                text2: 'Your product has been successfully updated!',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
            });
            updateProduct({id, name: values.name, price: parseFloat(values.price), image }, {
                onSuccess: () => {
                    resetForm();
                    router.back();
                },
            });
        } else {
            Toast.show({
                type: 'success',
                text1: 'Product Created',
                text2: 'Your product has been successfully created!',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
            });
            insertProduct({ name: values.name, price: parseFloat(values.price), image }, {
                onSuccess: () => {
                    resetForm();
                    router.back();
                },
            });
        }
        
    };
    const onDelete = () => {
        console.warn('Product deleted');
        deleteProduct(id, {
            onSuccess: () => {
              router.replace('/(admin)');
            },
          });
        Toast.show({
            type: 'success',
            text1: 'Product Deleted',
            text2: 'Your product has been successfully Deleted!',
            position: 'top',
            visibilityTime: 3000,
            autoHide: true,
        });
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: isUpdating ? 'Update' : 'Create Product' }} />
            <Image source={{ uri: data?.image || image || defaultPizzaImage }} style={styles.image} />
            <Text style={styles.textButton} onPress={pickImage}>Select Image</Text>

            <Formik
                initialValues={{ name: '', price: '' }}
                validate={validateInput}
                onSubmit={handleSubmit}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            placeholder={data? data.name:"Name"}
                            style={styles.input}
                            value={values.name}
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                        />
                        {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                        <Text style={styles.label}>Price (₹)</Text>
                        <TextInput
                            placeholder={data? data.price:"9.99"}
                            style={styles.input}
                            keyboardType='numeric'
                            value={values.price}
                            onChangeText={handleChange('price')}
                            onBlur={handleBlur('price')}
                        />
                        {touched.price && errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

                        <Button text={isUpdating ? 'Update' : 'Create'} onPress={() => handleSubmit()} />

                        {isUpdating && (
                            <Text onPress={() => setModalVisible(true)} style={styles.textButton}>Delete</Text>
                        )}
                    </>
                )}
            </Formik>

            <Modal
                isVisible={modalVisible}
                onBackdropPress={() => setModalVisible(false)}
                animationIn="zoomIn"
                animationOut="zoomOut"
                backdropOpacity={0.5}
                useNativeDriver
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Delete Product</Text>
                    <Text style={styles.modalText}>Are you sure you want to delete this product?</Text>
                    <View style={styles.modalActions}>
                        <Pressable style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </Pressable>
                        <Pressable style={[styles.button, styles.deleteButton]} onPress={onDelete}>
                            <Text style={styles.buttonText}>Delete</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
    },
    input: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 20,
    },
    label: {
        color: 'grey',
        fontSize: 16,
    },
    image: {
        width: '50%',
        aspectRatio: 1,
        alignSelf: 'center',
    },
    textButton: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: Colors.light.tint,
        marginVertical: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#ccc',
    },
    deleteButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default CreateProductScreen;
