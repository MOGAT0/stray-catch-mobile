import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Dimensions, Image, Modal, PanResponder, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const { width } = Dimensions.get('window');

const dummyFriends = [
  { id: '1', name: 'Alice', image: 'https://placehold.co/600x400.png' },
  { id: '2', name: 'Bob', image: 'https://placehold.co/600x400.png' },
  { id: '3', name: 'Charlie', image: 'https://placehold.co/600x400.png' },
  { id: '4', name: 'Diana', image: 'https://placehold.co/600x400.png' },
];

const Cards = ({ post }: { post: any }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  
  // Newly added state for tracking active image index
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [caption, setCaption] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<any>(null);

  const handleCloseShare = () => {
    setShowShare(false);
    setSelectedFriend(null);
    setCaption('');
  };

  const createSwipeDownResponder = (closeAction: () => void) => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy > 20 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 50) {
          closeAction();
        }
      },
    });
  };

  const commentsPanResponder = useRef(createSwipeDownResponder(() => setShowComments(false))).current;
  const sharePanResponder = useRef(createSwipeDownResponder(handleCloseShare)).current;

  // Newly added function to update the active dot index when scrolling
  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveImageIndex(index);
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <Image source={{ uri: post?.userImage }} style={styles.userImage} />
        <Text style={styles.userName}>{post?.userName}</Text>
      </View>

      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll} // Newly added scroll event listener
        scrollEventThrottle={16} // Fires frequently enough for smooth updating
      >
        {post?.images?.map((img: any, index: React.Key | null | undefined) => (
          <Image key={index} source={{ uri: img }} style={styles.postImage} />
        ))}
      </ScrollView>

      {/* Newly added conditional rendering for pagination dots */}
      {post?.images?.length > 1 && (
        <View style={styles.paginationContainer}>
          {post.images.map((_: any, index: number) => (
            <View 
              key={index} 
              style={[
                styles.dot, 
                activeImageIndex === index ? styles.activeDot : styles.inactiveDot
              ]} 
            />
          ))}
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={28} 
            color={isLiked ? "red" : "black"} 
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowComments(true)}>
          <Ionicons name="chatbox-ellipses-outline" size={28} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowShare(true)}>
          <Ionicons name="send-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Comment Section Modal */}
      <Modal 
        visible={showComments} 
        animationType="slide" 
        transparent={true}
        onRequestClose={() => setShowComments(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowComments(false)}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent} {...commentsPanResponder.panHandlers}>
              <View style={styles.dragHandle} />
              <Text style={styles.modalTitle}>Comments</Text>
              {/* {to-do: build out comment flatlist and text input} */}
            </View>
          </TouchableWithoutFeedback>
        </Pressable>
      </Modal>

      {/* Share Options Modal */}
      <Modal 
        visible={showShare} 
        animationType="slide" 
        transparent={true}
        onRequestClose={handleCloseShare}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseShare}>
          <TouchableWithoutFeedback>
            <View style={styles.shareContent} {...sharePanResponder.panHandlers}>
              <View style={styles.dragHandle} />

              <View style={styles.shareHeader}>
                <Text style={styles.modalTitle}>Share</Text>
              </View>

              {!selectedFriend ? (
                <View>
                  <TextInput
                    style={styles.captionInput}
                    placeholder="Write a caption..."
                    value={caption}
                    onChangeText={setCaption}
                    multiline
                  />
                  <TouchableOpacity style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Share Now</Text>
                  </TouchableOpacity>
                  {/* {to-do: implement share to feed functionality} */}
                </View>
              ) : (
                <View style={styles.sendActionContainer}>
                  <Text style={styles.sendTargetText}>Sending to {selectedFriend.name}</Text>
                  <TouchableOpacity style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Send</Text>
                  </TouchableOpacity>
                  {/* {to-do: implement direct message sending functionality} */}
                </View>
              )}

              <Text style={styles.sectionTitle}>Send to friends</Text>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.friendsContainer}>
                {dummyFriends.map((friend) => (
                  <TouchableOpacity 
                    key={friend.id} 
                    style={styles.friendCircleContainer}
                    onPress={() => setSelectedFriend(friend)}
                  >
                    <Image 
                      source={{ uri: friend.image }} 
                      style={[
                        styles.friendImage, 
                        selectedFriend?.id === friend.id && styles.friendImageSelected
                      ]} 
                    />
                    <Text style={styles.friendName} numberOfLines={1}>{friend.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Cards;

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  userImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eeeeee',
    marginRight: 10,
  },
  userName: {
    fontWeight: '600',
    fontSize: 15,
  },
  postImage: {
    width: width,
    height: width,
    backgroundColor: '#f5f5f5',
  },
  // Newly added styles for pagination dots
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: -4, // Counter balances action padding
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#FF6B35', // Primary highlight color
  },
  inactiveDot: {
    backgroundColor: '#D3D3D3', // Grayed out color
  },
  actions: {
    flexDirection: 'row',
    padding: 12,
    gap: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  modalContent: {
    backgroundColor: 'white',
    height: '60%',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  shareContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 15,
  },
  shareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  captionInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sendActionContainer: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  sendTargetText: {
    fontSize: 16,
    marginBottom: 15,
    fontWeight: '500',
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 15,
    marginTop: 10,
  },
  friendsContainer: {
    flexDirection: 'row',
  },
  friendCircleContainer: {
    alignItems: 'center',
    marginRight: 15,
    width: 60,
  },
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
    backgroundColor: '#e0e0e0',
  },
  friendImageSelected: {
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  friendName: {
    fontSize: 12,
    textAlign: 'center',
  }
});