import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { fetchMyProfile, upsertProfile, ProfileRow } from "../lib/api/profiles";

export type UserProfile = {
  email: string;
  name: string;
  bio: string;
  city: string;
  school: string;
  photo: string;
  motive: string;
  specificInterests: string;
  interests: string[];
  age?: number;
};

type UserContextType = {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  saveToDb: (updates?: Partial<UserProfile>) => Promise<void>;
  loading: boolean;
};

const defaultUser: UserProfile = {
  email: "",
  name: "",
  bio: "",
  city: "",
  school: "",
  photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&auto=format",
  motive: "",
  specificInterests: "",
  interests: [],
};

const UserContext = createContext<UserContextType | undefined>(undefined);

function profileRowToUser(row: ProfileRow, email: string): UserProfile {
  return {
    email,
    name: row.name,
    bio: row.bio,
    city: row.city,
    school: row.school,
    photo: row.photo_url || defaultUser.photo,
    motive: row.motive,
    specificInterests: row.specific_interests,
    interests: row.interests ?? [],
    age: row.age ?? undefined,
  };
}

function userToProfileRow(user: Partial<UserProfile>): Partial<Omit<ProfileRow, "id" | "created_at" | "updated_at">> {
  const row: any = {};
  if (user.name !== undefined) row.name = user.name;
  if (user.bio !== undefined) row.bio = user.bio;
  if (user.city !== undefined) row.city = user.city;
  if (user.school !== undefined) row.school = user.school;
  if (user.photo !== undefined) row.photo_url = user.photo;
  if (user.motive !== undefined) row.motive = user.motive;
  if (user.specificInterests !== undefined) row.specific_interests = user.specificInterests;
  if (user.interests !== undefined) row.interests = user.interests;
  if (user.age !== undefined) row.age = user.age;
  return row;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [loading, setLoading] = useState(true);

  // Load profile from DB when auth user changes
  useEffect(() => {
    if (!authUser) {
      setUser(defaultUser);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchMyProfile(authUser.id)
      .then((row) => {
        if (row) {
          setUser(profileRowToUser(row, authUser.email ?? ""));
        } else {
          setUser({ ...defaultUser, email: authUser.email ?? "" });
        }
      })
      .catch(() => {
        setUser({ ...defaultUser, email: authUser.email ?? "" });
      })
      .finally(() => setLoading(false));
  }, [authUser?.id]);

  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  }, []);

  const saveToDb = useCallback(async (updates?: Partial<UserProfile>) => {
    if (!authUser?.id) return;
    const finalUser = updates ? { ...user, ...updates } : user;
    await upsertProfile(authUser.id, userToProfileRow(finalUser));
  }, [authUser?.id, user]);

  const actualLoading = loading || (!!authUser && user.email !== authUser.email);

  return (
    <UserContext.Provider value={{ user, updateUser, saveToDb, loading: actualLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
