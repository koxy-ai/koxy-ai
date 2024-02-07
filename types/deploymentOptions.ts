interface DeploymentOptions {
  entryPointUrl: string;
  assets: Object;
  envVars: Object;
  description?: string | null;
  importMapUrl?: string | null;
  lockFileUrl?: string | null;
  compilerOptions?: {
    jsx?: string | null;
    jsxFactory?: string | null;
    jsxFragmentFactory?: string | null;
    jsxImportSource?: string | null;
  };
}

export default DeploymentOptions;
