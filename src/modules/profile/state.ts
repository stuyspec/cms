//tracks whether a user's attempt to create a user succeeded
//null signifies no attempt, false a failed attempt, and true a successful one
export interface IProfileState {
    createUserSucceeded: boolean | null,
    updateUserSucceeded: boolean | null
}

export const initialProfileState: IProfileState = {
    createUserSucceeded: null,
    updateUserSucceeded: null
}
