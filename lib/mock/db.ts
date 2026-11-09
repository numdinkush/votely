import { createCollection } from "@/lib/mock/collection"
import {
  SEED_CANDIDATES,
  SEED_ELECTIONS,
  SEED_USERS,
} from "@/lib/mock/seed"
import { SEED_VOTES } from "@/lib/mock/seed-votes"
import type { UserRecord } from "@/types/auth"
import type { Candidate, Election, Vote } from "@/types/election"

/** The mock database: one collection per resource. */
export const db = {
  users: createCollection<UserRecord>("users", SEED_USERS),
  elections: createCollection<Election>("elections", SEED_ELECTIONS),
  candidates: createCollection<Candidate>("candidates", SEED_CANDIDATES),
  votes: createCollection<Vote>("votes", SEED_VOTES),
}
