export interface CompetitionDTO {
  name: string;  // maximum length 255
  description: string;  // maximum length 255
  competitionRanking: CompetitionRanking;
  competitionScoreType: CompetitionScoreType;
  startDate: string;  // should be in the future or present
  endDate: string;  // should be in the future or present
}

export enum CompetitionScoreType {
  TIME = "TIME",
  POINT = "POINT"
}
export enum CompetitionRanking {
  BEST = "BEST",
  AVERAGE = "AVERAGE",
  AVERAGE_TOP_3 = "AVERAGE_TOP_3"
}
