// // import { Module } from '@nestjs/common';
// // import { JwtModule } from '@nestjs/jwt';
// // import { PassportModule } from '@nestjs/passport';
// // import { JwtStrategy } from './jwt.strategy';

// // @Module({
// //   imports: [
// //     PassportModule,
// //     JwtModule.register({
// //       secret: 'your_secret_key_here',
// //       signOptions: { expiresIn: '1h' },
// //     }),
// //   ],
// //   providers: [JwtStrategy],
// //   exports: [JwtModule],
// // })
// // export class AuthModule {}
// // import { Module } from '@nestjs/common';
// // import { PassportModule } from '@nestjs/passport';
// // // import { AzureAdStrategy } from './azure-ad.strategy';

// // @Module({
// //   imports: [PassportModule.register({ defaultStrategy: 'azure-ad' })],
// //   // providers: [AzureAdStrategy],
// // })
// // export class AuthModule {}

// // authz.module.ts

// import { Module } from '@nestjs/common';
// import { AzureTokenVerificationService } from './auth-service';
// // import { CaslAbilityFactory } from './casl-ability.factory';

// @Module({
//   providers: [],
//   exports: [AzureTokenVerificationService],
// })
// export class AuthzModule {}