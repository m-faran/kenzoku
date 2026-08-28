import { supabase } from "../supabase";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || "";

/**
 * Opens the image picker, uploads the selected image to Supabase Storage,
 * and returns the public URL. Returns null if the user cancels.
 */
export async function pickAndUploadAvatar(userId: string): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true, // Forces 1:1 square crop
    aspect: [1, 1],
    quality: 1, // We'll handle compression in the manipulator step
  });

  if (result.canceled || !result.assets[0]) return null;

  const originalAsset = result.assets[0];

  // Guarantee small file size by forcing pixel dimensions down to 500x500
  const manipulated = await manipulateAsync(
    originalAsset.uri,
    [{ resize: { width: 500, height: 500 } }],
    { compress: 0.7, format: SaveFormat.JPEG, base64: true }
  );

  const ext = "jpg";
  const filePath = `${userId}/avatar.${ext}`;

  // Supabase storage in React Native fails with FormData. We must use ArrayBuffer.
  const decodeBase64 = (base64: string): ArrayBuffer => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const lookup = new Uint8Array(256);
    for (let i = 0; i < chars.length; i++) {
      lookup[chars.charCodeAt(i)] = i;
    }
    let bufferLength = base64.length * 0.75;
    if (base64[base64.length - 1] === '=') {
      bufferLength--;
      if (base64[base64.length - 2] === '=') {
        bufferLength--;
      }
    }
    const arraybuffer = new ArrayBuffer(bufferLength);
    const bytes = new Uint8Array(arraybuffer);
    let p = 0;
    for (let i = 0; i < base64.length; i += 4) {
      const encoded1 = lookup[base64.charCodeAt(i)];
      const encoded2 = lookup[base64.charCodeAt(i + 1)];
      const encoded3 = lookup[base64.charCodeAt(i + 2)];
      const encoded4 = lookup[base64.charCodeAt(i + 3)];
      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
    return arraybuffer;
  };

  if (!manipulated.base64) {
    throw new Error("Could not extract image data.");
  }
  const arrayBuffer = decodeBase64(manipulated.base64);

  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, arrayBuffer, {
      upsert: true, // overwrite existing avatar
      contentType: 'image/jpeg'
    });

  if (error) throw error;

  // Return the public URL
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/avatars/${filePath}`;
  // Append cache-buster so the image refreshes
  return `${publicUrl}?t=${Date.now()}`;
}
