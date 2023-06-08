import {
    ParticipantChallengeProgress,
    ParticipantChallengeProgressProps,
    ProgressType,
} from "src/domain/value-object/participant/participant-challenge-progress";

describe('進捗ステータス', (): void => {
    test('進捗ステータスの値オブジェクトを生成できる', () => {
        const untouched: ParticipantChallengeProgressProps = { value: ProgressType.untouched }
        const actual = ParticipantChallengeProgress.create(untouched);

        expect(actual).toBeInstanceOf(ParticipantChallengeProgress);
        expect(actual.value).toBe(untouched.value)
    });

    test('想定していない進捗ステータスで値オブジェクトは生成できない', () => {
        const end: ParticipantChallengeProgressProps = { value: "end" }
        expect(() => {
            ParticipantChallengeProgress.create(end);
        }).toThrowError('進捗ステータスが誤っています。');
    });
});