// types/user.ts

export type UserRole =
    | "employee"
    | "supervisor";

export type UserId = string;

// työntekijän tietorakenne
export interface User {
    id: UserId;
    firstName: string;
    lastName: string;
    email: string;
    title: string;
    role: UserRole;
    managerId?: UserId; // vain työntekijöillä on managerId
}

