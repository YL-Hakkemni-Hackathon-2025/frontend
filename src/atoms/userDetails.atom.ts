import { atomWithStorage } from "jotai/utils";
import { UserResponseDto } from "@/dtos/user.dto";

export const userDetailsAtom = atomWithStorage<UserResponseDto | undefined>(
  "userDetails",
  undefined
);

