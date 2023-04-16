import { UniqueEntityID } from "src/shared/domain/unique-entity-id";
import { ParticipantId } from "../value-object/participant/participant-id";
import { ParticipantChallenge } from "../entity/participant/participant-challenge";
import { ChallengeId } from "../value-object/challenge/challenge-id";
import { ParticipantChallengeProgress, ProgressType } from "../value-object/participant/participant-challenge-progress";


describe('参加者所有課題', (): void => {
    const participantId = ParticipantId.create(new UniqueEntityID("1"))
    const challengeId = ChallengeId.create(new UniqueEntityID("1"))
    const progress = ParticipantChallengeProgress.create({ value: ProgressType.untouched })

    test('参加者所有課題を生成できる', () => {
        const participantChallenge = ParticipantChallenge.create({
            participantId: participantId,
            challengeId: challengeId,
            progress: progress,
        })

        expect(participantChallenge.participantId).toBe(participantId)
        expect(participantChallenge.challengeId).toBe(challengeId)
        expect(participantChallenge.progress).toBe(progress)
    });

    test('参加者課題の進捗ステータスを変更する', () => {
        const participantChallenge = ParticipantChallenge.create({
            participantId: participantId,
            challengeId: challengeId,
            progress: progress,
        })

        participantChallenge.updateProgress(ParticipantChallengeProgress.create({ value: ProgressType.waitingReview }))

        expect(participantChallenge.progress.value).toBe(ProgressType.waitingReview)
    });

    test('参加者課題の進捗ステータスが完了の場合、変更できない', () => {
        const participantChallenge = ParticipantChallenge.create({
            participantId: participantId,
            challengeId: challengeId,
            progress: ParticipantChallengeProgress.create({ value: ProgressType.completion }),
        })

        expect(() => {
            participantChallenge.updateProgress(ParticipantChallengeProgress.create({ value: ProgressType.waitingReview }))
        }).toThrowError("進捗ステータスが完了の場合更新できません。");
    });
});