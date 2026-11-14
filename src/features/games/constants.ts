// value = RAWG genre slug
export const GENRES = [
  { value: "action", label: "Action" },
  { value: "adventure", label: "Adventure" },
  { value: "role-playing-games-rpg", label: "RPG" },
  { value: "strategy", label: "Strategy" },
  { value: "shooter", label: "Shooter" },
  { value: "puzzle", label: "Puzzle" },
  { value: "platformer", label: "Platformer" },
  { value: "racing", label: "Racing" },
  { value: "sports", label: "Sports" },
  { value: "simulation", label: "Simulation" },
  { value: "indie", label: "Indie" },
  { value: "casual", label: "Casual" },
] as const;

// value = RAWG parent platform ID
export const PLATFORMS = [
  { value: "1", label: "PC" },
  { value: "2", label: "PlayStation" },
  { value: "3", label: "Xbox" },
  { value: "7", label: "Nintendo" },
  { value: "8", label: "Android" },
  { value: "4", label: "iOS" },
] as const;
