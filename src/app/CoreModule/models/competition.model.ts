import {
  CompetitionRanking,
  CompetitionScoreType,
  CompetitionSequenceRanking,
  CompetitionUser
} from "./association-competition";

export interface CompetitionDTO {
  name: string;  // maximum length 255
  description: string;  // maximum length 255
  competitionRanking: CompetitionRanking;
  competitionScoreType: CompetitionScoreType;
  startDate: string;  // should be in the future or present
  endDate: string;  // should be in the future or present
  useSequences: boolean;
  sequenceRanking: CompetitionSequenceRanking | null;
}

