import { useQuery } from "@tanstack/react-query";
import { fetchDiscoverProfiles, ProfileRow } from "../lib/api/profiles";
import { rankPeopleByCompatibility } from "../data/matchingAlgorithm";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";
import type { Person } from "../data/mockData";

/** Map a DB profile row to the Person type the UI expects */
function toPersona(row: ProfileRow): Person {
  return {
    id: row.id,
    name: row.name,
    age: row.age ?? 0,
    city: row.city,
    bio: row.bio,
    photo: row.photo_url,
    motive: row.motive || undefined,
    specificInterests: row.specific_interests || undefined,
    interests: row.interests ?? [],
  };
}

export function useDiscoverProfiles() {
  const { user: authUser } = useAuth();
  const { user } = useUser();

  return useQuery({
    queryKey: ["discover", authUser?.id, user.interests, user.specificInterests],
    queryFn: async () => {
      if (!authUser?.id) return [];
      const rows = await fetchDiscoverProfiles(authUser.id);
      const people = rows.map(toPersona);
      return rankPeopleByCompatibility(people, user.interests, user.specificInterests);
    },
    enabled: !!authUser?.id,
  });
}
