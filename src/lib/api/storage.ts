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
    { compress: 0.7, format: SaveFormat.JPEG }
  );

  const ext = "jpg";
  const filePath = `${userId}/avatar.${ext}`;

  // In React Native on Android, fetch().blob() for local files often fails.
  // The reliable way is to use FormData.
  const formData = new FormData();
  formData.append("file", {
    uri: manipulated.uri,
    name: "avatar.jpg",
    type: "image/jpeg",
  } as any);

  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, formData, {
      upsert: true, // overwrite existing avatar
    });

  if (error) throw error;

  // Return the public URL
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/avatars/${filePath}`;
  // Append cache-buster so the image refreshes
  return `${publicUrl}?t=${Date.now()}`;
}
