import {
    ParticipantEmail,
    ParticipantEmailProps,
} from "src/domain/value-object/participant/participant-email";

describe('参加者メールアドレス', (): void => {
    test('メールアドレスの値オブジェクトを生成できる', () => {
        const email: ParticipantEmailProps = { value: "sample@example.com" }
        const actual = ParticipantEmail.create(email);

        expect(actual.value).toBe(email.value)
    });

    test('空文字では値オブジェクトは生成できない', () => {
        const emptyEmail: ParticipantEmailProps = { value: "" }
        expect(() => {
            ParticipantEmail.create(emptyEmail);
        }).toThrowError('メールアドレス形式ではありません');
    });

    test('メールアドレス形式でなくては値オブジェクトは生成できない', () => {
        const emptyEmail: ParticipantEmailProps = { value: "example.com" }
        expect(() => {
            ParticipantEmail.create(emptyEmail);
        }).toThrowError('メールアドレス形式ではありません');
    });

});