import { ExoplanetData } from "@/components/galaxy";

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

function estimateA_AU(row: ExoplanetData): number | null {
  if (!row.pl_orbper || !row.st_mass) return null;
  const P_yr = row.pl_orbper / 365.25;
  const M = row.st_mass;
  return Math.cbrt(M * P_yr * P_yr);
}

export function computeTeq(row: ExoplanetData): number {
  if (row.pl_eqt) return row.pl_eqt;
  const Tstar = row.st_teff ?? undefined;
  const Rstar = row.st_rad ?? undefined; // em R☉
  const albedo = 0.3; // fallback
  const a = row.pl_orbsmax ?? estimateA_AU(row); // AU
  if (Tstar && Rstar && a) {
    const Teq = Tstar * Math.sqrt(Rstar / (2 * a)) * Math.pow(1 - albedo, 0.25);
    return clamp(Teq, 50, 4000);
  }
  const r = row.pl_rade ?? 1;
  if (r >= 6) return 1200;
  if (r >= 2) return 600;
  return 300;
}