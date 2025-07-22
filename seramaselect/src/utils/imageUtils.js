
/**
 * Compresses an image file using HTML5 Canvas
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - Maximum width (default: 800)
 * @param {number} maxHeight - Maximum height (default: 600)
 * @param {number} quality - JPEG quality 0-1 (default: 0.8)
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    console.log('🔄 Starting image compression...', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      maxWidth,
      maxHeight,
      quality
    });

    // Validate input
    if (!file || !file.type.startsWith('image/')) {
      console.error('❌ Invalid image file');
      reject(new Error('Invalid image file'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        console.log('✅ Image loaded successfully');
        
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        const originalWidth = width;
        const originalHeight = height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        console.log('🔄 Image dimensions:', {
          original: { width: originalWidth, height: originalHeight },
          resized: { width, height }
        });

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        console.log('✅ Image drawn to canvas');

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              console.error('❌ Failed to create blob from canvas');
              reject(new Error('Failed to compress image'));
              return;
            }

            console.log('✅ Blob created:', {
              size: blob.size,
              type: blob.type
            });

            // Create new File with original name and timestamp
            const compressedFile = new File(
              [blob], 
              `compressed_${Date.now()}_${file.name}`,
              {
                type: blob.type || 'image/jpeg',
                lastModified: Date.now()
              }
            );

            console.log('✅ Compressed file created:', {
              name: compressedFile.name,
              size: compressedFile.size,
              type: compressedFile.type
            });
            
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    
    // Load the image
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Gets image dimensions without loading into canvas
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};
