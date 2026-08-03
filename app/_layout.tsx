import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { Stack } from "expo-router";
import * as SecureStore from 'expo-secure-store';


const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Missing Publishable Key');
}

const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <Stack>
          <Stack.Screen
            name="index"
            options={{headerShown: false, title : "Main"}}
          />
        </Stack>
      </ClerkLoaded>
    </ClerkProvider>
  );
};
 

export default RootLayout;
