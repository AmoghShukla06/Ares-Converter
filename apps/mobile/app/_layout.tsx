import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

export default function RootLayout() {
    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#09090b" />
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: '#09090b' },
                    headerTintColor: '#fafafa',
                    headerTitleStyle: { fontWeight: '700' },
                    contentStyle: { backgroundColor: '#09090b' },
                }}
            >
                <Stack.Screen name="index" options={{ title: 'Ares Converter' }} />
            </Stack>
        </>
    );
}
