import {Image} from "./image.model";

export interface User {
  id: string;
  password: string;
  email: string;
  fullName: string;
  knsaMembershipNumber?: number | null;
  knsaMemberSince?: string | null;
  image?: Image | null;
}
