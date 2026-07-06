import { AnimatePresence, motion } from "motion/react";
import { MessageCircle } from "lucide-react";

interface FloatingWhatsAppProps {
  /** Collapse to the bare icon once the visitor has scrolled past the hero. */
  collapsed: boolean;
}

const WHATSAPP_URL = "https://wa.me/41772870956";

/**
 * Persistent quick-request affordance, present from the hero onward. Styled in
 * the forest card colour with a single gold hairline — one of the three
 * sanctioned gold uses (a primary CTA). Expanded near the top, it collapses to
 * an icon as the page scrolls so it stays unobtrusive.
 */
export default function FloatingWhatsApp({ collapsed }: FloatingWhatsAppProps) {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Request a chauffeur on WhatsApp"
      className="group fixed bottom-8 left-6 z-40 flex items-center gap-3 border border-brand-gold/40 bg-brand-deep-forest/95 px-4 py-3.5 text-brand-cream shadow-xl shadow-black/40 backdrop-blur-sm transition-colors duration-200 ease-out hover:border-brand-gold hover:text-brand-ivory md:left-8"
    >
      <MessageCircle className="h-4 w-4 shrink-0 text-brand-gold" strokeWidth={1.5} aria-hidden="true" />
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden whitespace-nowrap text-[10px] font-mono uppercase tracking-[0.2em]"
          >
            Request by WhatsApp
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}
