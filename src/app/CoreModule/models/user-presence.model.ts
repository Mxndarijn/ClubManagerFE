import {Association} from "./association.model";
import {CompetitionRanking, CompetitionScoreType, CompetitionUser} from "./association-competition";
import {User} from "./user.model";


export interface UserPresence {
  id: string;
  user: User;
  approvedBy: User;
  association: Association;
  date: string;
  createdDate: string;
}
