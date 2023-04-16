import { UniqueEntityID } from "src/shared/domain/unique-entity-id";
import { Pair } from "../pair/pair";
import { PairName } from "../../value-object/pair/pair-name";
import { ParticipantId } from "../../value-object/participant/participant-id";
import { TeamId } from "../../value-object/team/team-id";


describe('ペアエンティティ', (): void => {
    const pairId = new UniqueEntityID("1")
    const pairName = PairName.create({ value: "a" })
    const teamId = TeamId.create(new UniqueEntityID("1"))
    const participantId1 = ParticipantId.create(new UniqueEntityID("1"))
    const participantId2 = ParticipantId.create(new UniqueEntityID("2"))
    const participantId3 = ParticipantId.create(new UniqueEntityID("3"))

    test('ペアエンティティを生成できる', () => {
        const pair = Pair.create({
            name: pairName,
            teamId: teamId,
            participantIds: [participantId1, participantId2]
        }, pairId)

        expect(pair.pairId.id).toBe(pairId)
        expect(pair.name).toBe(pairName)
        expect(pair.teamId).toBe(teamId)
        expect(pair.participantIds[0]).toBe(participantId1)
        expect(pair.participantIds[1]).toBe(participantId2)
    });

    test('参加人数が満たない場合はペアエンティティを生成できない', () => {
        expect(() => {
            Pair.create({
                name: pairName,
                teamId: teamId,
                participantIds: [participantId1]
            }, pairId)
        }).toThrowError("ペアに所属できる参加者人数は2〜3名です");
    });

    test('参加人数が超えている場合はペアエンティティを生成できない', () => {
        expect(() => {
            Pair.create({
                name: pairName,
                teamId: teamId,
                participantIds: [participantId1, participantId2, participantId3, participantId3]
            }, pairId)
        }).toThrowError("ペアに所属できる参加者人数は2〜3名です");
    });

    test('ペアに参加者IDを追加する:join()', () => {
        const pair = Pair.create({
            name: pairName,
            teamId: teamId,
            participantIds: [participantId1, participantId2]
        }, pairId)
        const newParticipantId = ParticipantId.create(new UniqueEntityID("3"));

        pair.join(newParticipantId)

        expect(pair.participantIds.at(-1)).toBe(newParticipantId)
    });

    test('ペアから参加者IDを削除する:remove()', () => {
        const pair = Pair.create({
            name: pairName,
            teamId: teamId,
            participantIds: [participantId1, participantId2]
        }, pairId)

        pair.remove(participantId1)

        expect(pair.participantIds.includes(participantId1)).toBe(false)
    });

    test('ペアの参加者数を取得:numberOfParticipants()', () => {
        const pair = Pair.create({
            name: pairName,
            teamId: teamId,
            participantIds: [participantId1, participantId2]
        }, pairId)

        const participantLen = pair.numberOfParticipants()

        expect(participantLen).toBe(2)
    });

    test('ペアの参加者数が最大:isMaxParticipants()', () => {
        const pair = Pair.create({
            name: pairName,
            teamId: teamId,
            participantIds: [participantId1, participantId2, participantId3]
        }, pairId)

        expect(pair.isMaxParticipants()).toBe(true)
    });

    test('ペアの参加者数が最少以下:isMinParticipants()', () => {
        const pair = Pair.create({
            name: pairName,
            teamId: teamId,
            participantIds: [participantId1, participantId2]
        }, pairId)

        pair.remove(participantId1)

        expect(pair.isMinParticipants()).toBe(true)
    });
});