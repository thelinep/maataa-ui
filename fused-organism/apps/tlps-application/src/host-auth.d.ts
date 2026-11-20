interface Window {
  MAATAA_AUTH?: {
    getAccessToken: () => Promise<string | null>;
  };
}

interface ImportMetaEnv {
  readonly VITE_TLPS_API_BASE_URL?: string;
  readonly VITE_TLPS_SPATIAL_PROJECT_ID?: string;
  readonly VITE_TLPS_LOCAL_AUTH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
