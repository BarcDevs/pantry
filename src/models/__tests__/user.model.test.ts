/**
 * @jest-environment node
 */
import { UserModel } from '../user.model'

describe('UserModel schema', () => {
    it('defines required paths', () => {
        const { schema } = UserModel
        expect(schema.path('email')).toBeDefined()
        expect(schema.path('displayName')).toBeDefined()
        expect(schema.path('passwordHash')).toBeDefined()
    })

    it('onboardingCompletedAt defaults to null', () => {
        const user = new UserModel({
            email: 'a@b.com',
            displayName: 'Test'
        })
        expect(user.onboardingCompletedAt).toBeNull()
    })

    it('dietaryPreferences defaults to []', () => {
        const user = new UserModel({
            email: 'a@b.com',
            displayName: 'Test'
        })
        expect(user.dietaryPreferences).toEqual([])
    })
})
