import { Injectable } from '@nestjs/common';
import { Membership } from 'src/domain/entity/membership/membership';
import { IMembershipRepository } from 'src/domain/interface/membership/repository-interface/membership-repository';
import { MembershipEnrollmentStatus } from 'src/domain/value-object/membership/membership-enrollment-status';
import { MembershipId } from 'src/domain/value-object/membership/membership-id';
import { PairId } from 'src/domain/value-object/pair/pair-id';
import { ParticipantId } from 'src/domain/value-object/participant/participant-id';
import { TeamId } from 'src/domain/value-object/team/team-id';
import { PrismaService } from 'src/infra/db/prisma.service'
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id';

@Injectable()
export class MembershipRepository implements IMembershipRepository {
  public constructor(private readonly prisma: PrismaService) { }

  public async findById(membershipId: MembershipId): Promise<Membership | null> {
    const membership = await this.prisma.membership.findUnique({
      where: {
        id: membershipId.id.toString(),
      },
    })

    if (!membership) {
      return null
    }
    const membershipEntity = Membership.create({
      participantId: ParticipantId.create(new UniqueEntityID(membership.participantId)),
      teamId: TeamId.create(new UniqueEntityID(membership.teamId)),
      pairId: PairId.create(new UniqueEntityID(membership.pairId)),
      enrollmentStatus: MembershipEnrollmentStatus.create({ value: membership.enrollmentStatus }),
    }, new UniqueEntityID(membership.id))
    return membershipEntity
  }

  public async save(membership: Membership): Promise<Membership> {
    const updatedMembership = await this.prisma.membership.update({
      where: {
        id: membership.membershipId.id.toString()
      },
      data: {
        participantId: membership.participantId.id.toString(),
        teamId: membership.teamId.id.toString(),
        pairId: membership.pairId.id.toString(),
        enrollmentStatus: membership.enrollmentStatus.value,
      }
    })

    const membershipEntity = Membership.create({
      participantId: ParticipantId.create(new UniqueEntityID(updatedMembership.participantId)),
      teamId: TeamId.create(new UniqueEntityID(updatedMembership.teamId)),
      pairId: PairId.create(new UniqueEntityID(updatedMembership.pairId)),
      enrollmentStatus: MembershipEnrollmentStatus.create({ value: updatedMembership.enrollmentStatus }),
    }, new UniqueEntityID(updatedMembership.id))

    return membershipEntity
  }
}
