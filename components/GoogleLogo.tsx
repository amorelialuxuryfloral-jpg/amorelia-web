/**
 * Small inline Google wordmark (public/google-logo.webp, 240×79) shown
 * wherever the reviews UI says "Google" — product rating bar, the
 * "What Our Clients Say" blocks (home + ficha) and the closing
 * "5.0 on Google" summary. alt="Google" keeps the accessible/SEO text
 * identical to the word it replaces. Tasteful by default: 16px tall.
 */
const GoogleLogo = ({ className = "h-4" }: { className?: string }) => (
  <img
    src="/google-logo.webp"
    alt="Google"
    loading="lazy"
    decoding="async"
    width={240}
    height={79}
    className={`${className} w-auto inline-block align-middle`}
  />
);

export default GoogleLogo;
