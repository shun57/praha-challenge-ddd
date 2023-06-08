import {
    ParticipantEnrollmentStatusProps,
    ParticipantEnrollmentStatus,
    EnrollmentStatusType,
} from "src/domain/value-object/participant/participant-enrollment-status";

describe('在籍ステータス', (): void => {
    test('在籍ステータスの値オブジェクトを生成できる', () => {
        const enrolled: ParticipantEnrollmentStatusProps = { value: EnrollmentStatusType.enrolled }
        const actual = ParticipantEnrollmentStatus.create(enrolled);

        expect(actual).toBeInstanceOf(ParticipantEnrollmentStatus);
        expect(actual.value).toBe(enrolled.value)
    });

    test('想定していない在籍ステータスで値オブジェクトは生成できない', () => {
        const exist: ParticipantEnrollmentStatusProps = { value: "exist" }
        expect(() => {
            ParticipantEnrollmentStatus.create(exist);
        }).toThrowError('在籍ステータスが誤っています。');
    });

    test('在籍中の場合、isEnrolled()はtrue', () => {
        const enrolled: ParticipantEnrollmentStatusProps = { value: EnrollmentStatusType.enrolled }
        const actual = ParticipantEnrollmentStatus.create(enrolled);

        expect(actual.isEnrolled()).toBe(true)
    });

    test('在籍中ではに場合、isEnrolled()はfalse', () => {
        const recess: ParticipantEnrollmentStatusProps = { value: EnrollmentStatusType.recess }
        const actual = ParticipantEnrollmentStatus.create(recess);

        expect(actual.isEnrolled()).toBe(false)
    });

});