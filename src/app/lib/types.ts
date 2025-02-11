export interface PlexActivity {
  title: string;
  subtitle: string;
  progress: number;
  type: string;
}

export interface FormatConfig {
  variables: string[];
  outputFormat: string;
}
