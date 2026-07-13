"use client";

import { useState } from "react";
import { getTranslator, type Language } from "@/i18n";

/**
 * Contact form — client island (Web3Forms, same access key + payload as the
 * SPA). The rest of the contact page is server HTML.
 */
const ContactForm = ({ language = "en" }: { language?: Language }) => {
  const { t } = getTranslator(language);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "f63c8666-13a8-44b5-920f-1f2d0dacf1d3",
          name,
          email,
          message,
          subject: "Nuevo mensaje desde amorelialuxuryfloral.com",
          from_name: "Amorelia Luxury Floral Gifts Website",
        }),
      });
      const json = await res.json();
      if (json.success === true) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t("contact.yourName")}
        className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("contact.yourEmail")}
        className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      <textarea
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={t("contact.yourMessage")}
        rows={5}
        className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-primary text-primary-foreground px-8 py-3 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-lg w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? t("contact.sending") : t("contact.sendMessage")}
      </button>
      {status === "success" && (
        <p className="font-body text-sm text-primary text-center" role="status">
          {t("contact.successMessage")}
        </p>
      )}
      {status === "error" && (
        <p className="font-body text-sm text-destructive text-center" role="alert">
          {t("contact.errorMessage")}
        </p>
      )}
    </form>
  );
};

export default ContactForm;
