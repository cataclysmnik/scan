import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

export const generateAndSharePDF = async (imageUris: string[]): Promise<boolean> => {
  if (imageUris.length === 0) return false;

  // We compress and resize the images to A4-friendly dimensions before embedding.
  const manipulatedImages = await Promise.all(
    imageUris.map(async (uri) => {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1200 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      return {
        dataUri: `data:image/jpeg;base64,${manipResult.base64}`,
        width: manipResult.width,
        height: manipResult.height
      };
    })
  );

  // Using percentage-based CSS to perfectly fill the natively defined page dimensions.
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          @page { margin: 0; }
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background-color: white;
          }
          .page {
            width: 100%;
            height: 100%;
            page-break-after: always;
            overflow: hidden;
          }
          img {
            width: 100%;
            height: 100%;
            object-fit: fill;
            display: block;
          }
        </style>
      </head>
      <body>
        ${manipulatedImages
          .map(
            (img) => `
          <div class="page">
            <img src="${img.dataUri}" />
          </div>
        `
          )
          .join('')}
      </body>
    </html>
  `;

  try {
    const { base64 } = await Print.printToFileAsync({
      html: htmlContent,
      base64: true,
      width: manipulatedImages[0].width,
      height: manipulatedImages[0].height,
      margins: { left: 0, top: 0, right: 0, bottom: 0 },
    });

    if (!base64) return false;

    const filename = `Scanned_Document_${Date.now()}.pdf`;

    if (Platform.OS === 'android') {
      // Native Android Save-As dialog (Storage Access Framework)
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          filename,
          'application/pdf'
        );
        await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
        return true;
      } else {
        // User cancelled directory selection
        return false;
      }
    } else {
      // iOS doesn't have a direct SAF, the native way to save to files is via Share Sheet "Save to Files"
      const newPath = `${FileSystem.documentDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(newPath, base64, { encoding: FileSystem.EncodingType.Base64 });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newPath, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save Scanned Document',
          UTI: 'com.adobe.pdf',
        });
        return true;
      } else {
        console.warn('Sharing is not available on this platform.');
        return false;
      }
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};
