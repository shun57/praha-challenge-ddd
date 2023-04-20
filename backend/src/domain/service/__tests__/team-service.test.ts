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
import { TeamService } from "../team-service";
import { ITeamRepository } from "src/domain/interface/team/team-repository";

jest.mock("src/domain/interface/team/team-repository")

describe("TeamService", () => {
  let teamService: TeamService;
  let mockTeamRepo: jest.Mocked<ITeamRepository>

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

  const pairD = Pair.create({
    name: PairName.create({ value: "c" }),
    teamId: teamIds[1]!,
    participantIds: [participantIds[0]!, participantIds[1]!]
  }, new UniqueEntityID())

  const team1 = Team.create({
    name: TeamName.create({ value: "1" }),
    pairIds: [pairA.pairId, pairB.pairId],
    participantIds: participantIds
  }, teamIds[0]!.id)

  const team2 = Team.create({
    name: TeamName.create({ value: "2" }),
    pairIds: [pairC.pairId, pairD.pairId],
    participantIds: [participantIds[0]!, participantIds[1]!, participantIds[2]!, participantIds[3]!]
  }, teamIds[0]!.id)

  beforeEach(() => {
    mockTeamRepo = {
      getById: jest.fn(),
      getAll: jest.fn(),
      save: jest.fn(),
    };
    teamService = new TeamService(mockTeamRepo);
  });

  describe("getMinimumTeam", () => {
    test("最少人数のチームを返す", async () => {
      mockTeamRepo.getAll.mockResolvedValueOnce([team1, team2]);
      const result = await teamService.getMinimumTeam();
      expect(result).toBe(team2);
      expect(mockTeamRepo.getAll).toHaveBeenCalledTimes(1);
    });

    test("最少人数のペアがない場合、undefined", async () => {
      mockTeamRepo.getAll.mockResolvedValueOnce([]);
      const result = await teamService.getMinimumTeam();
      expect(result).toBe(undefined);
      expect(mockTeamRepo.getAll).toHaveBeenCalledTimes(1);
    });
  });
});