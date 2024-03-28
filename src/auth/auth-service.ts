// import { Injectable } from '@nestjs/common';
// import { CaslAbilityFactory } from './casl-ability.factory';

// @Injectable()
// export class AuthService {
//   constructor(private caslAbilityFactory: CaslAbilityFactory) {}

//   getAbility(user: User) {
//     return this.caslAbilityFactory.createForUser(user);
//   }
// }
import { Injectable } from '@nestjs/common';
import { JwtPayload, verify } from 'jsonwebtoken';
import { azureJwtVerify } from 'azure-jwt-verify';
import { AuthenticationResult, ConfidentialClientApplication } from '@azure/msal-node';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';

@Injectable()
export class AzureTokenVerificationService {
    static async verifyToken(token: string): Promise<AuthenticationResult | null> {
        try {
          const jwksUrl = 'https://login.microsoftonline.com/1a305825-ddf9-472c-818a-cd3e4aa03051/discovery/v2.0/keys';
          const { data } = await axios.get(jwksUrl);
          console.log("data---",data);
          
          const keys = data.keys.filter((key: any) => key.kid === jwt.decode(token, { complete: true })?.header.kid);
          console.log("keys---",keys);
          
          if (keys.length === 0) {
            throw new Error('Key not found');
          }
    
          const publicKey = `-----BEGIN CERTIFICATE-----\n${keys[0].x5c[0]}\n-----END CERTIFICATE-----`;
          console.log("publicKey---",publicKey);

          const decodedToken = jwt.verify(token, publicKey, {
            algorithms: ['RS256'],
            issuer: 'https://login.microsoftonline.com/1a305825-ddf9-472c-818a-cd3e4aa03051/v2.0',
          }) as AuthenticationResult;
    
          return decodedToken;
        } catch (error) {
          console.error('Token verification failed:', error);
          return null;
        }
    }
    
}

