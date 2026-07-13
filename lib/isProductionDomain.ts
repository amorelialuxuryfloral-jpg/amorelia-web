export const isProductionDomain = (): boolean => {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "amorelialuxuryfloral.com" || host === "www.amorelialuxuryfloral.com";
};
