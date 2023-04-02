import { Membership } from "src/domain/entity/membership/membership";
import { MembershipId } from "src/domain/value-object/membership/membership-id";
import { PairId } from "src/domain/value-object/pair/pair-id";
import { ParticipantId } from "src/domain/value-object/participant/participant-id";

export interface IMembershipRepository {
  getById(membershipId: MembershipId): Promise<Membership | null>
  getByPairIds(pairIds: PairId[]): Promise<Membership[]>
  getByParticipantId(participantId: ParticipantId): Promise<Membership | null>
  getByParticipantIds(participantIds: ParticipantId[]): Promise<Membership[]>
  save(membership: Membership): Promise<Membership>
  delete(membership: Membership): Promise<Membership>
}