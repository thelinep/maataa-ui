export type VerificationStatus = "DECLARED" | "VERIFIED" | "CONFLICTED" | "UNKNOWN";
export type DatabaseProvider = "postgresql" | "sqlite" | "libsql" | "mysql" | "other";
export type DatabaseState = "EMPTY" | "EXISTING" | "UNKNOWN";
export type EnvironmentKind = "local" | "development" | "test" | "staging" | "production" | "other";
export type ArtifactKind = "schema-baseline" | "migration-history" | "verification" | "backup" | "other";

export interface ArtifactReference {
  id: string;
  kind: ArtifactKind;
  sha256?: string;
  uri?: string;
}

export interface SecretReference {
  id: string;
  provider?: string;
  locator?: string;
}

export interface Repository {
  id: string;
  url: string;
  defaultBranch?: string;
  buildCommand?: string;
  outputDirectory?: string;
}

export interface DomainAssignment {
  id: string;
  hostname: string;
  environmentId: string;
  verificationStatus: VerificationStatus;
  evidence?: ArtifactReference[];
  routeMappings?: Array<{ path: string; routeId: string }>;
}

export interface ObservedDatabaseState {
  state: Exclude<DatabaseState, "UNKNOWN">;
  provider: DatabaseProvider;
  engineVersion: string;
}

interface DatabaseTargetBase {
  id: string;
  provider: DatabaseProvider;
  engineVersion?: string;
  verificationStatus: VerificationStatus;
  observed?: ObservedDatabaseState;
  evidence?: ArtifactReference[];
  secretRef?: string;
  backupPolicyRef?: string;
  migrationPolicyRef?: string;
}

export type DatabaseTarget =
  | (DatabaseTargetBase & {
      state: "EMPTY";
      baseline?: never;
      migrationHistory?: never;
    })
  | (DatabaseTargetBase & {
      state: "EXISTING";
      baseline: ArtifactReference;
      migrationHistory: ArtifactReference;
    })
  | (DatabaseTargetBase & {
      state: "UNKNOWN";
      baseline?: never;
      migrationHistory?: never;
      verificationStatus: "UNKNOWN";
      observed?: never;
    });

export interface EnvironmentResourceAssignment {
  resourceId: string;
  capabilities: string[];
}

export interface Environment {
  id: string;
  kind: EnvironmentKind;
  databaseTargets?: DatabaseTarget[];
  resources?: EnvironmentResourceAssignment[];
  deploymentPolicyRef?: string;
}

export interface ApplicationControlPlaneConfig {
  applicationId: string;
  repository?: Repository;
  domains?: DomainAssignment[];
  environments: Environment[];
}

export interface InfrastructureResource {
  id: string;
  kind: "runtime" | "storage" | "queue";
  provider: string;
  service: string;
  verificationStatus: VerificationStatus;
  region?: string;
  secretRef?: string;
  capabilities?: string[];
  evidence?: ArtifactReference[];
}

export interface BackupPolicy {
  id: string;
  restoreRehearsalRequired: boolean;
  recoveryPointObjective?: string;
  recoveryTimeObjective?: string;
  retentionDays?: number;
  resourceRef?: string;
}

export interface MigrationPolicy {
  id: string;
  requiresExplicitApproval: true;
  backupPolicyRef?: string;
  preflightRequirements?: string[];
}

export interface DeploymentPolicy {
  id: string;
  applicationId: string;
  environmentId: string;
  requiresExplicitApproval: true;
  healthChecks?: string[];
}

export interface ControlPlanePolicies {
  backups: BackupPolicy[];
  migrations: MigrationPolicy[];
  deployments: DeploymentPolicy[];
}

export interface ControlPlaneManifest {
  schemaVersion: "1.0.0";
  applications: ApplicationControlPlaneConfig[];
  infrastructureResources: InfrastructureResource[];
  secretReferences: SecretReference[];
  policies: ControlPlanePolicies;
}

export interface ApplicationAuthoringConfig {
  applicationId: string;
  repository?: Repository;
  domains?: DomainAssignment[];
  environments: Environment[];
}

export interface ControlPlaneAuthoringManifest {
  schemaVersion: "1.0.0";
  applications: ApplicationAuthoringConfig[];
  infrastructureResources?: InfrastructureResource[];
  secretReferences?: SecretReference[];
  policies?: Partial<ControlPlanePolicies>;
}

export interface RegisteredApplication {
  appId: string;
  name: string;
}

export interface ApplicationRegistry {
  registryId: string;
  schemaVersion: string;
  records: RegisteredApplication[];
}

export interface ControlPlaneTargetInventory {
  schemaVersion: "1.0.0";
  controlPlaneHash: string;
  targetCounts: {
    declared: number;
    verified: number;
    conflicted: number;
    unknown: number;
    byProvider: Record<DatabaseProvider, number>;
  };
  targets: Array<Record<string, unknown>>;
  applicationCount: number;
  environmentCount: number;
  migrationApproved: false;
  deploymentApproved: false;
}

export function defineApplication<const T extends ApplicationAuthoringConfig>(application: T): T;
export function defineEnvironment<const T extends Environment>(environment: T): T;
export function defineControlPlaneManifest<const T extends ControlPlaneAuthoringManifest>(manifest: T): T;
export function validateControlPlaneManifest(manifest: unknown, applicationRegistry: ApplicationRegistry): { valid: boolean; errors: string[] };
export function compileControlPlaneManifest(manifest: unknown, applicationRegistry: ApplicationRegistry): {
  canonical: Record<string, unknown>;
  canonicalJson: string;
  hash: string;
  targetInventory: ControlPlaneTargetInventory;
};
export function canonicalizeControlPlaneManifest(value: unknown): string;
export function hashControlPlaneManifest(value: unknown): string;
export function deriveMigrationTargets(canonical: Record<string, unknown>, controlPlaneHash: string): ControlPlaneTargetInventory;
