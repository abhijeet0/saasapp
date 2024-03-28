import { AzureAdService } from "src/adapter-classes/azure-ad-service";

export class Constants {
    static USERS_VALIDATION = {
        nameMaxLength:50,
        nameMinLength:2,
        passwordMaxLength:50,
        passwordMinLength:8,
        emailMaxLength:100,
        emailMinLength:5,
        mobileMaxLength:6,
        mobileMinLength:15,
    }

    static ROLES_VALIDATION = {
        nameMaxLength:50,
        nameMinLength:2    
    }

    static GROUPS_VALIDATION = {
        nameMaxLength:50,
        nameMinLength:2  
    }

    static REQUEST_FOR_DEMO_VALIDATION = {
        firstNameMaxLength:50,
        firstNameMinLength:2,
        lastNameMaxLength:50,
        lastNameMinLength:2,
        emailMaxLength:100,
        emailMinLength:5,
        mobileMaxLength:6,
        mobileMinLength:15,
        statusMaxLength:6,
        statusMinLength:15,
    }
    
    static IS_ACTIVE_LENGTH = 1;

    static IS_DELETE_LENGTH = 1;

    static COMPANY_VALIDATION = {
        nameMaxLength:100,
        nameMinLength:5    
    }

 
    
    
}
