// auth.utils.ts

import { Ability } from '@casl/ability';

export function canPerformAction(ability: Ability, action: string, resource: string) {
  return ability.can(action, resource);
}