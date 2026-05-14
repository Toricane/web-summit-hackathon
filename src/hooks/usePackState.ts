import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import {
  AI_MATCH_SETS,
  INITIAL_MAP_POSITIONS,
  INITIAL_STATUS_FEED,
  MEMBERS,
  OTHER_MEMBER_IDS,
  STATUS_PRESETS,
  WISHLIST,
  type AIMatch,
  type MemberId,
  type StatusEntry,
  type StatusPresetId,
} from "../data/mockPack";

const STORAGE_KEY = "wsv-pack-state-v1";

export type PackState = {
  joined: boolean;
  wishlist: Record<string, MemberId[]>;
  statusFeed: StatusEntry[];
  mapPositions: Record<MemberId, { x: number; y: number }>;
  aiMatchSetIndex: number;
};

function seed(): PackState {
  const wishlist: Record<string, MemberId[]> = {};
  for (const row of WISHLIST) wishlist[row.eventId] = [...row.goers];
  return {
    joined: false,
    wishlist,
    statusFeed: [...INITIAL_STATUS_FEED],
    mapPositions: { ...INITIAL_MAP_POSITIONS },
    aiMatchSetIndex: 0,
  };
}

type Action =
  | { type: "JOIN" }
  | { type: "LEAVE" }
  | { type: "BROADCAST"; preset: StatusPresetId }
  | { type: "TOGGLE_WISHLIST"; eventId: string }
  | { type: "MOVE_USER"; x: number; y: number }
  | { type: "REFRESH_AI" }
  | { type: "HYDRATE"; payload: PackState };

function reducer(state: PackState, action: Action): PackState {
  switch (action.type) {
    case "JOIN":
      return { ...state, joined: true };
    case "LEAVE":
      return { ...seed() };
    case "BROADCAST": {
      const incremented = state.statusFeed.map((s) => ({
        ...s,
        minutesAgo: s.minutesAgo + 1,
      }));
      const remainingOthers = incremented.filter(
        (s) => s.memberId !== "you",
      );
      const newEntry: StatusEntry = {
        memberId: "you",
        preset: action.preset,
        minutesAgo: 0,
      };
      return { ...state, statusFeed: [newEntry, ...remainingOthers] };
    }
    case "TOGGLE_WISHLIST": {
      const current = state.wishlist[action.eventId] ?? [];
      const isGoing = current.includes("you");
      const nextGoers: MemberId[] = isGoing
        ? current.filter((m) => m !== "you")
        : [...current, "you"];
      return {
        ...state,
        wishlist: { ...state.wishlist, [action.eventId]: nextGoers },
      };
    }
    case "MOVE_USER":
      return {
        ...state,
        mapPositions: {
          ...state.mapPositions,
          you: { x: action.x, y: action.y },
        },
      };
    case "REFRESH_AI":
      return {
        ...state,
        aiMatchSetIndex:
          (state.aiMatchSetIndex + 1) % AI_MATCH_SETS.length,
      };
    case "HYDRATE":
      return action.payload;
    default:
      return state;
  }
}

type PackContextValue = {
  state: PackState;
  members: typeof MEMBERS;
  otherMemberIds: MemberId[];
  join: () => void;
  leave: () => void;
  broadcast: (preset: StatusPresetId) => void;
  toggleWishlist: (eventId: string) => void;
  moveUser: (x: number, y: number) => void;
  refreshAiMatches: () => void;
  currentAiMatches: AIMatch[];
  goersFor: (eventId: string) => MemberId[];
  isUserGoing: (eventId: string) => boolean;
  presetById: (id: StatusPresetId) => (typeof STATUS_PRESETS)[number];
};

const PackContext = createContext<PackContextValue | null>(null);

export function PackProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, seed);
  const hydratedRef = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PackState;
        dispatch({ type: "HYDRATE", payload: parsed });
      }
    } catch {
      // ignore corrupt storage
    } finally {
      hydratedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state]);

  const value = useMemo<PackContextValue>(() => {
    const presetMap = new Map(STATUS_PRESETS.map((p) => [p.id, p]));
    const goersFor = (eventId: string) => state.wishlist[eventId] ?? [];
    return {
      state,
      members: MEMBERS,
      otherMemberIds: OTHER_MEMBER_IDS,
      join: () => dispatch({ type: "JOIN" }),
      leave: () => dispatch({ type: "LEAVE" }),
      broadcast: (preset) => dispatch({ type: "BROADCAST", preset }),
      toggleWishlist: (eventId) =>
        dispatch({ type: "TOGGLE_WISHLIST", eventId }),
      moveUser: (x, y) => dispatch({ type: "MOVE_USER", x, y }),
      refreshAiMatches: () => dispatch({ type: "REFRESH_AI" }),
      currentAiMatches: AI_MATCH_SETS[state.aiMatchSetIndex],
      goersFor,
      isUserGoing: (eventId) => goersFor(eventId).includes("you"),
      presetById: (id) => presetMap.get(id)!,
    };
  }, [state]);

  return createElement(PackContext.Provider, { value }, children);
}

export function usePackState(): PackContextValue {
  const ctx = useContext(PackContext);
  if (!ctx)
    throw new Error("usePackState must be used inside <PackProvider>");
  return ctx;
}

export function memberById(id: MemberId) {
  return MEMBERS.find((m) => m.id === id)!;
}
