import type {
  PermActions,
  PermissionsResourceName,
} from '../../src/casl/casl-ability/casl-ability.service';

declare global {
  namespace PrismaJson {
    type PermissionList = Array<{
      action: PermActions;
      resource: PermissionsResourceName;
      condition?: Record<string, unknown>;
    }>;
  }
}
