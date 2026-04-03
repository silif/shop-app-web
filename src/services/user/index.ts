import http from "@/utils/request";
import type { UserProfile } from "./dto";

const BASE_URL = "/api/users";

export const userService = {
  getMyProfile: () => {
    return http.get<UserProfile>(`${BASE_URL}/me`);
  },
};

export default userService;
