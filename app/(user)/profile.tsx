import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const Profile = () => {
  const router=useRouter()
  const { session } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session?.user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data);
      setFullName(data.full_name);
      setAddress(data.address);
      setPhoneNumber(data.phone_number);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)/sign-in")
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        address: address,
        phone_number: phoneNumber,
      })
      .eq('id', session?.user.id);

    if (error) {
      console.error('Update failed:', error);
      Alert.alert('Error', 'Could not update profile.');
    } else {
      setIsEditing(false);
      fetchProfile();
      Alert.alert('Success', 'Profile updated successfully!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Full Name</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your name"
          />
        ) : (
          <Text style={styles.value}>{profile?.full_name || 'N/A'}</Text>
        )}

        <Text style={styles.label}>Address</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your address"
          />
        ) : (
          <Text style={styles.value}>{profile?.address || 'N/A'}</Text>
        )}

        <Text style={styles.label}>Phone Number</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
        ) : (
          <Text style={styles.value}>{profile?.phone_number || 'N/A'}</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: isEditing ? '#4CAF50' : '#007AFF' }]}
        onPress={isEditing ? handleSave : () => setIsEditing(true)}
      >
        <Text style={styles.buttonText}>{isEditing ? 'Save' : 'Edit Profile'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#FF5C5C', marginTop: 15 }]} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginTop: 12,
  },
  value: {
    fontSize: 18,
    color: '#222',
    marginTop: 4,
  },
  input: {
    fontSize: 18,
    color: '#222',
    marginTop: 4,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 4,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Profile;
