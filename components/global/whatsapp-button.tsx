"use client";

export function WhatsAppButton() {
  const phone = "256755077903";
  const message = encodeURIComponent(
    "Hello Virgo Building Society, I would like to inquire about your programs."
  );

  const url = "https://wa.me/" + phone + "?text=" + message;

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      {/* subtle pulse ring */}
      <span className="absolute -inset-2 rounded-full bg-[#25D366]/20 animate-ping" />
      <span className="absolute -inset-1 rounded-full bg-[#25D366]/15" />

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-xl transition active:scale-95 hover:shadow-2xl"
      >
        {/* WhatsApp icon (official-style) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="h-7 w-7 fill-white"
        >
          <path d="M19.11 17.59c-.28-.14-1.66-.82-1.92-.91-.26-.09-.45-.14-.64.14-.19.28-.73.91-.89 1.09-.16.19-.33.21-.61.07-.28-.14-1.19-.44-2.27-1.39-.84-.75-1.41-1.67-1.57-1.95-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49l-.55-.01c-.19 0-.49.07-.75.35-.26.28-1 1-.98 2.44.02 1.44 1.03 2.83 1.18 3.03.14.19 2.03 3.1 4.92 4.35.69.3 1.23.48 1.65.62.69.22 1.31.19 1.8.11.55-.08 1.66-.68 1.89-1.34.23-.65.23-1.21.16-1.34-.07-.14-.26-.21-.54-.35z" />
          <path d="M16.04 3C9.41 3 4.02 8.39 4.02 15.02c0 2.21.6 4.36 1.73 6.23L4 29l7.91-1.69a12 12 0 0 0 4.13.73h.01c6.63 0 12.02-5.39 12.02-12.02C28.06 8.39 22.67 3 16.04 3zm0 21.82h-.01c-1.36 0-2.69-.36-3.86-1.04l-.28-.16-4.7 1 1.01-4.58-.18-.3a9.8 9.8 0 0 1-1.5-5.23c0-5.43 4.42-9.85 9.85-9.85 5.43 0 9.85 4.42 9.85 9.85 0 5.43-4.42 9.85-9.85 9.85z" />
        </svg>

        {/* tooltip */}
        <div className="pointer-events-none absolute right-16 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-2xl border border-black/10 bg-white px-3 py-2 text-xs font-medium text-ink shadow-lg group-hover:block">
          Chat with us on WhatsApp
        </div>
      </a>
    </div>
  );
}