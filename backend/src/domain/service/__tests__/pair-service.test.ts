import { IPairRepository } from "src/domain/interface/pair/pair-repository";
import { PairService } from "../pair-service";
import { PairName } from "src/domain/value-object/pair/pair-name";
import { Pair } from "src/domain/entity/pair/pair";
import { TeamId } from "src/domain/value-object/team/team-id";
import { UniqueEntityID } from "src/shared/domain/unique-entity-id";
import { ParticipantId } from "src/domain/value-object/participant/participant-id";
import { TeamName } from "src/domain/value-object/team/team-name";
import { Team } from "src/domain/entity/team/team";
import { CleanPrismaService } from "src/infra/db/prisma.service";

jest.mock("src/domain/interface/pair/pair-repository")

describe("PairService", () => {
  let pairService: PairService;
  let mockPairRepo: jest.Mocked<IPairRepository>

  const participantIds = [
    ParticipantId.create(new UniqueEntityID("1")),
    ParticipantId.create(new UniqueEntityID("2")),
    ParticipantId.create(new UniqueEntityID("3")),
    ParticipantId.create(new UniqueEntityID("4")),
    ParticipantId.create(new UniqueEntityID("5")),
  ]

  const teamIds = [
    TeamId.create(new UniqueEntityID("1")),
    TeamId.create(new UniqueEntityID("2"))
  ]

  const pairA = Pair.create({
    name: PairName.create({ value: "a" }),
    teamId: teamIds[0]!,
    participantIds: [participantIds[0]!, participantIds[1]!]
  }, new UniqueEntityID())

  const pairB = Pair.create({
    name: PairName.create({ value: "b" }),
    teamId: teamIds[0]!,
    participantIds: [participantIds[2]!, participantIds[3]!, participantIds[4]!]
  }, new UniqueEntityID())

  const pairC = Pair.create({
    name: PairName.create({ value: "c" }),
    teamId: teamIds[1]!,
    participantIds: [participantIds[2]!, participantIds[3]!]
  }, new UniqueEntityID())

  const team = Team.create({
    name: TeamName.create({ value: "123" }),
    pairIds: [pairA.pairId, pairB.pairId],
    participantIds: participantIds
  }, teamIds[0]!.id)

  beforeEach(() => {
    mockPairRepo = {
      getByParticipantId: jest.fn(),
      getByParticipantIds: jest.fn(),
      getByTeamId: jest.fn(),
      getAll: jest.fn(),
      save: jest.fn(),
      saveInTransaction: jest.fn(),
      getById: jest.fn(),
      getByIds: jest.fn(),
      deleteInTransaction: jest.fn()
    };
    pairService = new PairService(mockPairRepo);
  });

  describe("isSameTeamBy", () => {
    test("同じチームの場合、true", async () => {
      mockPairRepo.getByParticipantIds.mockResolvedValueOnce([pairA, pairB]);
      const result = await pairService.isSameTeamBy(participantIds);
      expect(result).toBe(true);
      expect(mockPairRepo.getByParticipantIds).toHaveBeenCalledWith(participantIds);
    });

    test("対象参加者がペアに所属していない場合、エラー", async () => {
      mockPairRepo.getByParticipantIds.mockResolvedValueOnce([]);
      await expect(pairService.isSameTeamBy(participantIds)).rejects.toThrow("対象参加者がペアに所属していません。");
      expect(mockPairRepo.getByParticipantIds).toHaveBeenCalledWith(participantIds);
    });

    test("同じチームの参加者がいない場合、false", async () => {
      mockPairRepo.getByParticipantIds.mockResolvedValueOnce([pairA, pairC]);
      const result = await pairService.isSameTeamBy(participantIds);
      expect(result).toBe(false);
      expect(mockPairRepo.getByParticipantIds).toHaveBeenCalledWith(participantIds);
    });
  });

  describe("getMinimumPairBy", () => {
    test("最少人数のペアを返す", async () => {
      mockPairRepo.getByTeamId.mockResolvedValueOnce([pairA, pairB]);
      const result = await pairService.getMinimumPairBy(team);
      expect(result).toBe(pairA);
      expect(mockPairRepo.getByTeamId).toHaveBeenCalledTimes(1);
    });

    test("ペアを渡された場合は除外する", async () => {
      mockPairRepo.getByTeamId.mockResolvedValueOnce([pairA, pairB]);
      const result = await pairService.getMinimumPairBy(team, pairA);
      expect(result).toBe(pairB);
      expect(mockPairRepo.getByTeamId).toHaveBeenCalledTimes(1);
    });

    test("最少人数のペアがない場合、undefined", async () => {
      mockPairRepo.getByTeamId.mockResolvedValueOnce([]);
      const result = await pairService.getMinimumPairBy(team);
      expect(result).toBe(undefined);
      expect(mockPairRepo.getByTeamId).toHaveBeenCalledTimes(1);
    });
  });

  describe('devidePairIfOverMember', () => {
    it('ペアの参加者を1人減らして2つのペアに分割すること', async () => {
      const pair = Pair.create({
        name: PairName.create({ value: "z" }),
        teamId: teamIds[0]!,
        participantIds: [participantIds[0]!, participantIds[1]!, participantIds[2]!]
      }, new UniqueEntityID())

      const prisma = {} as CleanPrismaService
      const mockSaveInTransaction = mockPairRepo.saveInTransaction

      await pairService.devidePairIfOverMember(pair, participantIds[4]!, prisma)

      expect(pair.participantIds.length).toBe(2)
      expect(mockSaveInTransaction).toHaveBeenCalledWith(pair, prisma)
      expect(mockSaveInTransaction).toHaveBeenLastCalledWith(
        expect.not.objectContaining(pair),
        prisma,
      )
    })
  })

});