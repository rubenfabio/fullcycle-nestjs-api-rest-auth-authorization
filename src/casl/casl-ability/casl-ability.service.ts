import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Injectable, Scope } from '@nestjs/common';
import { Post, User } from '@prisma/client';

export type PermActions = 'manage' | 'create' | 'read' | 'update' | 'delete';

export type PermissionsResource = Subjects<{ User: User; Post: Post }> | 'all';

export type PermissionsResourceName = 'User' | 'Post' | 'all';

export type AppAbility = PureAbility<
  [PermActions, PermissionsResource],
  PrismaQuery
>;

export type DefinePermissions = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void;

const rolePermissionsMap: Record<User['role'], DefinePermissions> = {
  ADMIN: (user, { can }) => {
    can('manage', 'all');
  },
  EDITOR: (user, { can }) => {
    can('create', 'Post');
    can('read', 'Post');
    can('update', 'Post');
  },
  WRITER: (user, { can }) => {
    can('create', 'Post');
    can('read', 'Post', { authorId: user.id });
    can('update', 'Post', { authorId: user.id });
  },
  READER: (user, { can }) => {
    can('read', 'Post', {
      published: true,
    });
  },
};

@Injectable({
  scope: Scope.REQUEST,
})
export class CaslAbilityService {
  ability: AppAbility;

  createForUser(user: User) {
    const builder = new AbilityBuilder<AppAbility>(createPrismaAbility);
    user.permissions?.forEach((permission) => {
      builder.can(permission.action, permission.resource, permission.condition);
    });
    rolePermissionsMap[user.role](user, builder);
    this.ability = builder.build();
    return this.ability;
  }
}
