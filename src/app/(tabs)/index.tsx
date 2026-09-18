import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { CameraView, useCameraPermissions, FlashMode } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { CameraOverlay } from '../../components/CameraOverlay';
import { ScanPreviewModal } from '../../components/ScanPreviewModal';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing, layout } from '../../theme/spacing';

export default function ScannerScreen() {
  const { themeColors } = useTheme();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<FlashMode>('off');
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Typography variant="h2" style={{ marginBottom: spacing.md }}>Permission Required</Typography>
        <Typography variant="body" color={themeColors.textSecondary} style={{ marginBottom: spacing.xl, textAlign: 'center' }}>
          Camera access is required for document scanning operations.
        </Typography>
        <Button title="Grant Access" onPress={requestPermission} />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        if (photo) {
          setCapturedImages(prev => [...prev, photo.uri]);
        }
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  };

  const toggleFlash = () => {
    setFlash(current => {
      if (current === 'off') return 'on';
      if (current === 'on') return 'auto';
      return 'off';
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Controls */}
      <View style={styles.topControls}>
        <TouchableOpacity 
          onPress={() => router.push('/home')}
          style={[styles.homeButton, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}
        >
          <Typography variant="caption" color={themeColors.text}>
            [ HOME ]
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={toggleFlash}
          style={[styles.flashButton, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}
        >
          <Typography variant="caption" color={themeColors.text}>
            Flash: {flash.toUpperCase()}
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Camera Viewfinder */}
      <View style={styles.cameraWrapper}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          flash={flash}
          animateShutter={false}
        >
          <CameraOverlay />
        </CameraView>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <View style={styles.sideButtonContainer}>
           {/* Left side empty for balance */}
        </View>
        
        <TouchableOpacity 
          style={[styles.captureButtonOuter, { borderColor: themeColors.primary }]}
          onPress={takePicture}
        >
          <View style={[styles.captureButtonInner, { backgroundColor: themeColors.primary }]} />
        </TouchableOpacity>
        
        <View style={styles.sideButtonContainer}>
          {capturedImages.length > 0 && (
            <TouchableOpacity 
              style={[styles.queueBadge, { backgroundColor: themeColors.surface }]}
              onPress={() => setShowPreview(true)}
            >
              <Typography variant="caption" color={themeColors.text}>
                {capturedImages.length} 
              </Typography>
              <Typography variant="caption" color={themeColors.textSecondary}>
                {capturedImages.length === 1 ? 'Page' : 'Pages'}
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScanPreviewModal 
        visible={showPreview} 
        images={capturedImages}
        onClose={() => setShowPreview(false)}
        onClear={() => setCapturedImages([])}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60, // Top safe area allowance
    paddingBottom: 40, // Bottom safe area allowance
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  cameraWrapper: {
    flex: 1,
    marginHorizontal: spacing.md,
    borderRadius: 24,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  homeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderRadius: layout.pillRadius,
  },
  flashButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderRadius: layout.pillRadius,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  captureButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
  },
  sideButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  queueBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: layout.pillRadius,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
