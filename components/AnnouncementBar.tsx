"use client";

import { useEffect, useMemo, useState } from "react";
import { getMiamiTime } from "@/lib/miamiTime";
import type { Language } from "@/i18n";

/**
 * Announcement bar. The message depends on the CURRENT Miami time, which
 * differs between the server render and the client's load time → hydration
 * mismatch if rendered directly. Render a deterministic default first
 * (identical on server and first client render), then switch to the
 * time-accurate message after mount. (Same fix as the SPA's #418.)
 */
const AnnouncementBar = ({ language = "en" }: { language?: Language }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const message = useMemo(() => {
    if (!mounted) {
      return language === "es"
        ? "Entrega en el mismo día disponible - Pide antes de las 3PM"
        : "Same-day delivery available - Order before 3PM";
    }
    const { hours, day: dayOfWeek } = getMiamiTime();
    // Closing hours: Sun=closed, Sat=17, Mon-Fri=19
    const closeHour = dayOfWeek === 6 ? 17 : 19;
    const cutoff = 15; // 3PM

    // Sunday closed
    if (dayOfWeek === 0) {
      return language === "es"
        ? "Entrega al día siguiente - Pide ahora"
        : "Next-day delivery - Order now";
    }
    if (hours < cutoff) {
      return language === "es"
        ? "Entrega en el mismo día disponible - Pide antes de las 3PM"
        : "Same-day delivery available - Order before 3PM";
    }
    if (hours < closeHour) {
      return language === "es"
        ? "Entrega al día siguiente - Pide ahora"
        : "Next-day delivery - Order now";
    }
    return language === "es"
      ? "Entrega al día siguiente - Pide ahora"
      : "Next-day delivery - Order now";
  }, [language, mounted]);

  return (
    <div className="bg-primary text-primary-foreground text-center py-1.5 font-body text-[11px] md:text-xs tracking-wider">
      {message}
    </div>
  );
};

export default AnnouncementBar;
