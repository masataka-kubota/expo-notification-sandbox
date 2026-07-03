import { Text, View, StyleSheet } from 'react-native';

export default function RedirectSuccess() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Redirect Success!</Text>
      <Text style={styles.message}>
        You successfully navigated to this page by tapping a push notification.
      </Text>
      <Text style={styles.subtitle}>
        This proves that the notification deep link is working correctly.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
