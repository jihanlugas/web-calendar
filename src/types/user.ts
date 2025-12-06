import { CompanyView } from "./company";



export declare interface UserView {
    id: string;
    companyId: string;
    usercompanyId: string;
    role: string;
    email: string;
    username: string;
    phoneNumber: string;
    address: string;
    fullname: string;
    passVersion: number;
    isActive: boolean;
    photoId: string;
    photoUrl: string;
    lastLoginDt?: string;
    birthDt?: string;
    birthPlace: string;
    accountVerifiedDt?: string;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;

    company: CompanyView;
    // usercompanies: UsercompanyView[];
}