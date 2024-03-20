import { UniqueEntityID } from "src/shared/domain/unique-entity-id";
import { ParticipantId } from "../../value-object/participant/participant-id";
import { Team } from "../team/team";
import { TeamName } from "../../value-object/team/team-name";
import { PairId } from "../../value-object/pair/pair-id";


describe('チームエンティティ', (): void => {
    const teamId = new UniqueEntityID("1")
    const teamName = TeamName.create({ value: "123" })
    const pairId1 = PairId.create(new UniqueEntityID("1"))
    const pairId2 = PairId.create(new UniqueEntityID("2"))
    const participantId1 = ParticipantId.create(new UniqueEntityID("1"))
    const participantId2 = ParticipantId.create(new UniqueEntityID("2"))
    const participantId3 = ParticipantId.create(new UniqueEntityID("3"))
    const participantId4 = ParticipantId.create(new UniqueEntityID("4"))
    const participantId5 = ParticipantId.create(new UniqueEntityID("5"))

    test('チームエンティティを生成できる', () => {
        const team = Team.create({
            name: teamName,
            pairIds: [pairId1, pairId2],
            participantIds: [participantId1, participantId2, participantId3]
        }, teamId)

        expect(team.teamId.id).toBe(teamId)
        expect(team.name.value).toBe(teamName.value)
        expect(team.pairIds.at(0)).toBe(pairId1)
        expect(team.pairIds.at(1)).toBe(pairId2)
        expect(team.participantIds.at(0)).toBe(participantId1)
        expect(team.participantIds.at(1)).toBe(participantId2)
        expect(team.participantIds.at(2)).toBe(participantId3)
    });

    test('参加人数が満たない場合はチームエンティティを生成できない', () => {
        expect(() => {
            Team.create({
                name: teamName,
                pairIds: [pairId1],
                participantIds: [participantId1, participantId2]
            }, teamId)
        }).toThrowError("チームメンバーが足りていません。");
    });

    test('チームの参加者数を取得する:numberOfParticipants()', () => {
        const team = Team.create({
            name: teamName,
            pairIds: [pairId1, pairId2],
            participantIds: [participantId1, participantId2, participantId3]
        }, teamId);

        expect(team.numberOfParticipants()).toBe(3);
    });
});