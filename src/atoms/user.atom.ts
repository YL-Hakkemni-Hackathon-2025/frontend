import {atomWithStorage} from "jotai/utils";
import {AuthTokenResponseDto} from "@/dtos/auth.dto.ts";

export const userAtom =
    atomWithStorage<AuthTokenResponseDto | undefined>('user', undefined)
