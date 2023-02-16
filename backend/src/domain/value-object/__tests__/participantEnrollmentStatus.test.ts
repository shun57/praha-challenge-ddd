import {
    ParticipantEnrollmentStatusProps,
    ParticipantEnrollmentStatus,
    EnrollmentStatusType,
} from "src/domain/value-object/participant/participantEnrollmentStatus";

describe('在籍ステータス', (): void => {
    test('在籍ステータスの値オブジェクトを生成できる', () => {
        const enrolled: ParticipantEnrollmentStatusProps = { value: EnrollmentStatusType.enrolled }
        // 上記で生成したのを引数に値オブジェクトを生成
        const actual = ParticipantEnrollmentStatus.create(enrolled);

        // 生成されている
        expect(actual).toBeInstanceOf(ParticipantEnrollmentStatus);
        expect(actual.value).toBe(enrolled.value)
    });

    test('想定していない在籍ステータスで値オブジェクトは生成できない', () => {
        const exist: ParticipantEnrollmentStatusProps = { value: "exist" }
        // 値オブジェクトを生成するとエラーが起きる
        expect(() => {
            ParticipantEnrollmentStatus.create(exist);
        }).toThrowError('在籍ステータスが誤っています。');
    });
});