import {Track} from "../track.model";

export interface CreateTrackResponseDTO {
  success: boolean;
  message: string;
  track?: Track;
}
