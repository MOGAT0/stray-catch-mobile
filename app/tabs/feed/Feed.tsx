import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Cards from '@/components/feed/cards';

const Feed = () => {

// Replaced the previously generic Unsplash image URLs in the 'images' array with specific Unsplash cat photo URLs for all posts.
// The unique post IDs and original userImage URLs remain unchanged.

const dummyPost = {
  id: '1',
  userName: 'Sam Jefferson',
  userImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  images: [
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1513360371669-4dc3fd289ea4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1529778453086-ab23d0fb0f07?auto=format&fit=crop&w=600&q=80'
  ]
};

const dummyPost2 = {
  id: '2',
  userName: 'Herold Mel',
  userImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
  images: [
    'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1501820488136-72669149e0d4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1533738363-e7f9d4d15f23?auto=format&fit=crop&w=600&q=80'
  ]
};

const dummyPost3 = {
  id: '3',
  userName: 'Joshua',
  userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  images: [
    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1529257414772-1960b7bea4eb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1503777119540-ce54b422baff?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80'
  ]
};

const dummyPost4 = {
  id: '4',
  userName: 'Jeremy',
  userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  images: [
    'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1494256997604-768d1f608cac?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=600&q=80'
  ]
};

const dummyPost5 = {
  id: '5',
  userName: 'Pearl Ann',
  userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  images: [
    'https://images.unsplash.com/photo-1520315342629-6ea920342047?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1472491235688-bdc81a63246e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1488015795646-7e22a773d72a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1500856056008-859079534e9e?auto=format&fit=crop&w=600&q=80'
  ]
};

// {to-do} Consolidate these individual objects into a single array for easier iteration if needed later.

  return (
    <SafeAreaView style={styles.scrollScreen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Render Cards with the dummy data */}
        <Cards post={dummyPost} />
        <Cards post={dummyPost5} />
        <Cards post={dummyPost2} />
        <Cards post={dummyPost3} />
        <Cards post={dummyPost4} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Feed;

const styles = StyleSheet.create({
  scrollScreen: {
    flex: 1,
    backgroundColor: '#ffffff'
    // justifyContent: 'center', // Commented out so content starts at the top
  }
});