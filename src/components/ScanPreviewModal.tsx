import React, { useState, useRef } from 'react';
import { View, StyleSheet, Modal, Image, TouchableOpacity, TextInput, FlatList, useWindowDimensions } from 'react-native';
import { Typography } from './Typography';
import { Button } from './Button';
import { useTheme } from '../theme/ThemeProvider';
import { spacing, layout } from '../theme/spacing';
import { generateAndSharePDF } from '../utils/pdfGenerator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { useRouter } from 'expo-router';

interface ScanPreviewModalProps {
  visible: boolean;
  images: string[];
  onClose: () => void;
  onClear: () => void;
}

export const ScanPreviewModal: React.FC<ScanPreviewModalProps> = ({
  visible,
  images,
  onClose,
  onClear,
}) => {
  const { themeColors } = useTheme();
  const { width } = useWindowDimensions();
  const router = useRouter();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [docName, setDocName] = useState(`Scan ${new Date().toLocaleDateString()}`);
  
  // Track current images to allow deletion
  const [currentImages, setCurrentImages] = useState<string[]>(images);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sync images prop when modal opens
  React.useEffect(() => {
    if (visible) {
      setCurrentImages(images);
      setCurrentIndex(0);
    }
  }, [visible, images]);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    // Call our pdf generator (which uses Native SAF on Android / Share Sheet on iOS)
    // We will ALSO record it in AsyncStorage for the Home screen to list
    const success = await generateAndSharePDF(currentImages);
    
    if (success) {
      try {
        const existing = await AsyncStorage.getItem('saved_scans');
        const scans = existing ? JSON.parse(existing) : [];
        scans.push({
          id: Date.now().toString(),
          title: docName,
          date: new Date().toISOString(),
          pageCount: currentImages.length,
          coverImage: currentImages[0], // Store local URI for thumbnail
        });
        await AsyncStorage.setItem('saved_scans', JSON.stringify(scans));
      } catch (e) {
        console.error("Failed to save scan record", e);
      }
    }
    
    setIsGenerating(false);
    
    if (success) {
      onClear();
      onClose();
      router.push('/home');
    }
  };

  const deleteCurrentPage = () => {
    if (currentImages.length <= 1) {
      onClear();
      onClose();
      return;
    }
    const newImages = [...currentImages];
    newImages.splice(currentIndex, 1);
    setCurrentImages(newImages);
    if (currentIndex >= newImages.length) {
      setCurrentIndex(newImages.length - 1);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Typography variant="body" color={themeColors.textSecondary}>Cancel</Typography>
          </TouchableOpacity>
          
          <TextInput 
            style={[styles.titleInput, { color: themeColors.text }]}
            value={docName}
            onChangeText={setDocName}
            placeholderTextColor={themeColors.textSecondary}
          />
          
          <Button 
            title="Save PDF" 
            variant="primary" 
            onPress={handleGeneratePDF}
            loading={isGenerating}
            style={styles.saveButton}
          />
        </View>

        {/* Carousel */}
        <FlatList
          data={currentImages}
          keyExtractor={(item, idx) => `${item}-${idx}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          renderItem={({ item }) => (
            <View style={[styles.pageWrapper, { width }]}>
              <View style={[styles.imageContainer, { backgroundColor: themeColors.surface }]}>
                <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
              </View>
            </View>
          )}
        />

        {/* Pagination Indicator */}
        <Typography variant="caption" style={styles.pageIndicator} color={themeColors.textSecondary}>
          {currentIndex + 1} of {currentImages.length}
        </Typography>

        {/* Bottom Toolbar */}
        <View style={[styles.bottomToolbar, { borderTopColor: themeColors.border }]}>
          <TouchableOpacity style={styles.toolButton}>
             <Typography variant="caption" color={themeColors.textSecondary}>Crop</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton}>
             <Typography variant="caption" color={themeColors.textSecondary}>Rotate</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton} onPress={deleteCurrentPage}>
             <Typography variant="caption" color="#FF3B30">Delete</Typography>
          </TouchableOpacity>
        </View>

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xxxl, // safe area approx
    paddingBottom: spacing.sm,
  },
  closeButton: {
    padding: spacing.sm,
  },
  titleInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: spacing.sm,
  },
  saveButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  pageWrapper: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: layout.borderRadius,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pageIndicator: {
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  bottomToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxxl, // safe area approx
    borderTopWidth: 1,
  },
  toolButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  }
});
