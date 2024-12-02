export interface DefaultBooleanResponseDTO {
  success: boolean;
  message: string;
}


export interface LoginResponseDTO {
  success: boolean;
  message: string;
  refreshToken: string;
}
