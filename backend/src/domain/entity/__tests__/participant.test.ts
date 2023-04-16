import { UniqueEntityID } from "src/shared/domain/unique-entity-id";
import { Participant } from "../participant/participant";
import { ParticipantName } from "../../value-object/participant/participant-name";
import { ParticipantEmail } from "../../value-object/participant/participant-email";
import { EnrollmentStatusType, ParticipantEnrollmentStatus } from "../../value-object/participant/participant-enrollment-status";


describe('参加者エンティティ', (): void => {
    const participantId = new UniqueEntityID("1")
    const name = ParticipantName.create({ value: "太郎" })
    const email = ParticipantEmail.create({ value: "test@example.com" })
    const enrollmentStatus = ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.enrolled })

    test('参加者エンティティを生成できる', () => {
        const participant = Participant.create({
            name: name,
            email: email,
            enrollmentStatus: enrollmentStatus,
        }, participantId)

        expect(participant.participantId.id).toBe(participantId)
        expect(participant.name).toBe(name)
        expect(participant.email).toBe(email)
        expect(participant.enrollmentStatus).toBe(enrollmentStatus)
    });

    test('参加者の在籍ステータスを更新する:updateEnrollmentStatus()', () => {
        const participant = Participant.create({
            name: name,
            email: email,
            enrollmentStatus: enrollmentStatus,
        }, participantId)

        participant.updateEnrollmentStatus(ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.recess }))

        expect(participant.enrollmentStatus.value).toBe(EnrollmentStatusType.recess)
    });

    test('参加者は復帰するか:isComeback()', () => {
        const participant = Participant.create({
            name: name,
            email: email,
            enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.recess }),
        }, participantId)

        expect(
            participant.isComeback(ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.enrolled }))
        ).toBe(true)
    });

    test('参加者は退会・休会するか:isSecession()', () => {
        const participant = Participant.create({
            name: name,
            email: email,
            enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.enrolled }),
        }, participantId)

        expect(
            participant.isSecession(ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.recess }))
        ).toBe(true)
    });

});