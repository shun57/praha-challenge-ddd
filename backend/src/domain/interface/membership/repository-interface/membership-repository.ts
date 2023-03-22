import { Membership } from "src/domain/entity/membership/membership";
import { MembershipId } from "src/domain/value-object/membership/membership-id";

export interface IMembershipRepository {
  findById(membershipId: MembershipId): Promise<Membership | null>
  save(membership: Membership): Promise<Membership>
}