export type HealthStatus = {
  status: "ok";
  version: string;
  time: string;
};

export function getHealth(now: Date = new Date()): HealthStatus {
  return {
    status: "ok",
    version: process.env.npm_package_version ?? "0.0.0",
    time: now.toISOString(),
  };
}
