import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AzureTokenVerificationService } from './auth-service';

@Injectable()
export class AzureTokenAuthGuard extends AuthGuard('azure-token') {
  constructor(private readonly azureTokenVerificationService: AzureTokenVerificationService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];
    console.log("authorizationHeaderauthorizationHeader",authorizationHeader);
    
    if (!authorizationHeader) {
      return false;
    }

    const token = authorizationHeader.replace('Bearer ', '');
    console.log("token",token);
    
    try {
    console.log("azureTokenVerificationService",this.azureTokenVerificationService);
    
      const result = await AzureTokenVerificationService.verifyToken(token);
      console.log("tokenresult",result);

      request.user = result.account;
      return true;
    } catch (error) {
       console.log("errorerror",error);
       
      return false;
    }
  }
}
