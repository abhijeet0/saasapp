// // casl-ability.factory.ts

// import { Ability, AbilityBuilder } from '@casl/ability';
// import { Injectable } from '@nestjs/common';
// import { Roles } from 'src/roles/roles.model';

// @Injectable()
// export class CaslAbilityFactory {
//   createForUser(role:Roles) {
//     const { roles } = role;

//     const ability = new AbilityBuilder(Ability);

//     roles.forEach((role) => {
//       ability.can(role.permissions);
//     });

//     return ability.build();
//   }
// }