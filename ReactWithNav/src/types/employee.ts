export interface ExperienceTitle{
    experienceTitleId:number;
    titleName:string
}
export interface Experience{
    experienceId?:number;
    employeeId?:number;
experienceTitleId:number;
duration:number;
experienceTitle?:ExperienceTitle;
}
export interface Employee{
    employeeId:number;
    employeeName:string;
    isActive:boolean;
    joinDate:string;
    imageUrl?:string;
    imageName?:string;
    experiences:Experience[]
}

export interface ExperienceDTO{
experienceTitleId:number;
duration:number;
}