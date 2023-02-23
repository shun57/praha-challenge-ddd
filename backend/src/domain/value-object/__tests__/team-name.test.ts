import {
    TeamName,
    TeamNameProps,
} from "src/domain/value-object/team/team-name";

describe('チーム名', (): void => {
    test('チーム名の値オブジェクトを生成できる', () => {
        const team1: TeamNameProps = { value: "123" }
        const actual = TeamName.create(team1);

        expect(actual.value).toBe(team1.value)
    });

    test('空文字では値オブジェクトは生成できない', () => {
        const emptyTeamName: TeamNameProps = { value: "" }
        expect(() => {
            TeamName.create(emptyTeamName);
        }).toThrowError('チーム名は必須です');
    });

    test('数字以外では値オブジェクトは生成できない', () => {
        const stringTeamName: TeamNameProps = { value: "チーム１" }
        expect(() => {
            TeamName.create(stringTeamName);
        }).toThrowError('チーム名は数字にしてください');
    });

    test('3文字以上では値オブジェクトは生成できない', () => {
        const tooLongTeamName: TeamNameProps = { value: "1234" }
        expect(() => {
            TeamName.create(tooLongTeamName);
        }).toThrowError('チーム名は3文字以下にしてください');
    });

});