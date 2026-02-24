"use client";

export function WhatsAppButton() {
  const phone = "256755077903";
  const message = encodeURIComponent(
    "Hello Virgo Building Society, I would like to inquire about your programs."
  );

  const url = "https://wa.me/" + phone + "?text=" + message;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-[9999] h-14 w-14 rounded-full bg-green-600 text-white shadow-xl hover:bg-green-700 active:scale-95 transition"
      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="26" height="26" fill="white">
        <path d="M19.11 17.59c-.28-.14-1.66-.82-1.92-.91-.26-.09-.45-.14-.64.14-.19.28-.73.91-.89 1.09-.16.19-.33.21-.61.07-.28-.14-1.19-.44-2.27-1.39-.84-.75-1.41-1.67-1.57-1.95-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.64-1.54-.88-2.11-.23-.56-.47-.48-.64-.49l-.55-.01c-.19 0-.49.07-.75.35-.26.28-1 1-.98 2.44.02 1.44 1.03 2.83 1.18 3.03.14.19 2.03 3.1 4.92 4.35.69.3 1.23.48 1.65.62.69.22 1.31.19 1.8.11.55-.08 1.66-.68 1.89-1.34.23-.65.23-1.21.16-1.34-.07-.14-.26-.21-.54-.35z"/>
      </svg>
    </a>
  );
}