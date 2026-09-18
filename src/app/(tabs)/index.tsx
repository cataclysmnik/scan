import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CameraView, useCameraPermissions, FlashMode } from 'expo-camera';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { CameraOverlay } from '../../components/CameraOverlay';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../theme/spacing';

export default function ScannerScreen() {
  const { themeColors } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<FlashMode>('off');
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Typography variant="h2" style={{ marginBottom: spacing.md }}>[ PERMISSION_REQ ]</Typography>
        <Typography variant="body" color={themeColors.textSecondary} style={{ marginBottom: spacing.xl, textAlign: 'center' }}>
          Camera access is required for document scanning operations.
        </Typography>
        <Button title="GRANT ACCESS" onPress={requestPermission} />
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
          setPreviewUri(photo.uri);
        }
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  };

  const retakePicture = () => {
    setPreviewUri(null);
  };

  const acceptPicture = () => {
    // Save/Process logic will go here.
    // For now, just log and reset.
    console.log('Accepted photo:', previewUri);
    setPreviewUri(null);
  };

  const toggleFlash = () => {
    setFlash(current => {
      if (current === 'off') return 'on';
      if (current === 'on') return 'auto';
      return 'off';
    });
  };

  if (previewUri) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Image source={{ uri: previewUri }} style={StyleSheet.absoluteFillObject} resizeMode="contain" />
        <View style={styles.previewControls}>
          <Button title="[ RETAKE ]" variant="secondary" onPress={retakePicture} />
          <Button title="[ ACCEPT ]" variant="primary" onPress={acceptPicture} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        flash={flash}
        animateShutter={false}
      >
        <CameraOverlay />
        
        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity 
            onPress={toggleFlash}
            style={[styles.flashButton, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}
          >
            <Typography variant="caption" color={themeColors.text}>
              FLASH: {flash.toUpperCase()}
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity 
            style={[styles.captureButtonOuter, { borderColor: themeColors.primary }]}
            onPress={takePicture}
          >
            <View style={[styles.captureButtonInner, { backgroundColor: themeColors.primary }]} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topControls: {
    position: 'absolute',
    top: spacing.xxl,
    width: '100%',
    alignItems: 'center',
  },
  flashButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderRadius: 4,
  },
  bottomControls: {
    position: 'absolute',
    bottom: spacing.xxl,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  previewControls: {
    position: 'absolute',
    bottom: spacing.xxl,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.xl,
  },
});
