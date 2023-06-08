import {
    PairName,
    PairNameProps,
} from "src/domain/value-object/pair/pair-name";

describe('ペア名', (): void => {
    test('ペア名の値オブジェクトを生成できる', () => {
        const pairA: PairNameProps = { value: "a" }
        const actual = PairName.create(pairA);

        expect(actual.value).toBe(pairA.value)
    });

    test('空文字では値オブジェクトは生成できない', () => {
        const emptyTeamName: PairNameProps = { value: "" }
        // 値オブジェクトを生成するとエラーが起きる
        expect(() => {
            PairName.create(emptyTeamName);
        }).toThrowError('ペア名は1文字にしてください');
    });

    test('2文字では値オブジェクトは生成できない', () => {
        const emptyTeamName: PairNameProps = { value: "ab" }
        // 値オブジェクトを生成するとエラーが起きる
        expect(() => {
            PairName.create(emptyTeamName);
        }).toThrowError('ペア名は1文字にしてください');
    });

    test('英文字以外では値オブジェクトは生成できない', () => {
        const stringTeamName: PairNameProps = { value: "1" }
        // 値オブジェクトを生成するとエラーが起きる
        expect(() => {
            PairName.create(stringTeamName);
        }).toThrowError('ペア名は英文字にしてください');
    });

});