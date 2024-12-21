import {Association} from "./association.model";
import {User} from "./user.model";

export interface AssociationCompetition {
  id: string;
  name: string;
  description: string;
  association: Association;
  startDate: string; // Assuming LocalDateTime is represented as a string
  endDate: string; // Assuming LocalDateTime is represented as a string
  scoreType: CompetitionScoreType;
  ranking: CompetitionRanking;
  competitionUsers?: CompetitionUser[];
  active: boolean;
}

export interface CompetitionRemoveScoreDTO {
  userID: string;
  competitionID: string;
  scoreId: string;
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

export enum CompetitionSequenceRanking {
  BEST = "BEST",
  AVERAGE = "AVERAGE",
  AVERAGE_TOP_3 = "AVERAGE_TOP_3"
}

export interface CompetitionUser {
  id: CompetitionUserId;
  user: User;
  competition: AssociationCompetition;
  competitionRank: number;
  scores?: CompetitionScore[];
  calculatedScore: string;
}

export interface CompetitionUserId {
  userId: string;
  competitionId: string;
}

export interface CompetitionScore {
  id: string;
  competitionUser: CompetitionUser;
  scoreDate: string; // Assuming LocalDateTime is represented as a string
  score: number; // Assuming Long is represented as a number
  competitionRank?: number;
}

export interface CompetitionDTO {
  name: string;
  description: string;
  competitionRanking: CompetitionRanking;
  competitionScoreType: CompetitionScoreType;
  startDate: string; // Assuming LocalDateTime is represented as a string
  endDate: string; // Assuming LocalDateTime is represented as a string
  competitionSequence: boolean;
}

export interface CompetitionResponseDTO {
  success: boolean;
  message?: string;
  competition?: AssociationCompetition;
}

export interface CompetitionUserDTO {
  userID: string;
  competitionID: string;
}

export interface CompetitionScoreDTO {
  userID: string;
  competitionID: string;
  score: number; // Assuming Long is represented as a number
  scoreDate: string; // Assuming LocalDateTime is represented as a string
}

export interface SmallCompetitionScore {
  score: number; // Assuming Long is represented as a number
  scoreDate: string; // Assuming LocalDateTime is represented as a string
}
