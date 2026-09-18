import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing, layout } from '../../theme/spacing';

interface ScanRecord {
  id: string;
  title: string;
  date: string;
  pageCount: number;
  coverImage: string;
}

export default function HomeScreen() {
  const { themeColors } = useTheme();
  const router = useRouter();
  const [scans, setScans] = useState<ScanRecord[]>([]);

  // Fetch scans when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const loadScans = async () => {
        try {
          const data = await AsyncStorage.getItem('saved_scans');
          if (data) {
            setScans(JSON.parse(data).reverse()); // newest first
          }
        } catch (e) {
          console.error('Error loading scans', e);
        }
      };
      loadScans();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      
      {scans.length === 0 ? (
        <View style={styles.emptyState}>
          <Typography variant="h3" color={themeColors.textSecondary}>No Scans Yet</Typography>
          <Typography variant="body" color={themeColors.textSecondary} style={styles.emptySubtitle}>
            Tap the camera button to create your first PDF.
          </Typography>
        </View>
      ) : (
        <FlatList
          data={scans}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card style={styles.scanCard}>
              <View style={styles.cardLayout}>
                <View style={[styles.thumbnailContainer, { backgroundColor: themeColors.surface }]}>
                  {item.coverImage ? (
                    <Image source={{ uri: item.coverImage }} style={styles.thumbnail} />
                  ) : null}
                </View>
                <View style={styles.cardDetails}>
                  <Typography variant="body" style={styles.scanTitle}>{item.title}</Typography>
                  <Typography variant="caption" color={themeColors.textSecondary}>
                    {new Date(item.date).toLocaleDateString()} • {item.pageCount} {item.pageCount === 1 ? 'Page' : 'Pages'}
                  </Typography>
                </View>
              </View>
            </Card>
          )}
        />
      )}

      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: themeColors.primary }]}
        onPress={() => router.push('/')}
      >
        <Typography variant="h2" color="#FFF">📸</Typography>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 100, // space for fab
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptySubtitle: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  scanCard: {
    marginBottom: spacing.md,
    padding: spacing.sm,
  },
  cardLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnailContainer: {
    width: 60,
    height: 80,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: spacing.md,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  scanTitle: {
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xxxl,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  }
});
