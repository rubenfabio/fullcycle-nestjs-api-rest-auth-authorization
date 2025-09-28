import type {
  PermActions,
  PermissionsResource,
} from '../../src/casl/casl-ability/casl-ability.service';

declare global {
  namespace PrismaJson {
    type PermissionList = Array<{
      action: PermActions;
      resource: PermissionsResource;
      condition?: Record<string, unknown>;
    }>;
  }
}
