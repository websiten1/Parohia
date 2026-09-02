export type WaitlistLang = "ro" | "en";

export interface WaitlistCopy {
  header: { wordmark: string; langToggleLabel: string };
  hero: {
    eyebrow: string;
    hierarchPlaceholder: string;
    tagline: string;
    description: string;
  };
  screenshot: { alt: string; placeholderNote: string };
  featuresHeading: string;
  features: { eyebrow: string; title: string; body: string }[];
  form: {
    heading: string;
    name: { label: string; placeholder: string; error: string };
    parish: { label: string; placeholder: string; error: string };
    location: { label: string; placeholder: string; error: string };
    email: { label: string; placeholder: string; errorRequired: string; errorInvalid: string };
    phone: { label: string; placeholder: string };
    parishioners: {
      label: string;
      placeholder: string;
      options: { value: string; label: string }[];
    };
    submit: string;
    submitting: string;
    retry: string;
    gdpr: string;
    successTitle: string;
    successBody: string;
    errorTitle: string;
    errorBody: string;
  };
  footer: { contactLabel: string; contactEmail: string };
}

export const WAITLIST_COPY: Record<WaitlistLang, WaitlistCopy> = {
  ro: {
    header: { wordmark: "Parohia Mea", langToggleLabel: "Limbă" },
    hero: {
      eyebrow: "CU BINECUVÂNTAREA IERARHULUI",
      hierarchPlaceholder: "[Preasfințitul ___]",
      tagline: "Parohia ta, la un loc",
      description:
        "O aplicație simplă prin care enoriașii țin legătura cu viața parohiei — anunțuri, calendar liturgic și comunitate, toate într-un singur loc.",
    },
    screenshot: {
      alt: "Captură din aplicația Parohia Mea",
      placeholderNote: "→ se va înlocui cu o captură reală din aplicație",
    },
    featuresHeading: "Ce oferă",
    features: [
      {
        eyebrow: "PENTRU ENORIAȘI",
        title: "Anunțuri către enoriași",
        body: "Vești și evenimente ale parohiei, trimise direct în telefon.",
      },
      {
        eyebrow: "CALENDAR",
        title: "Calendar liturgic",
        body: "Sfinții zilei, posturile și programul slujbelor, mereu la îndemână.",
      },
      {
        eyebrow: "COMUNITATE",
        title: "Comunitatea ta, aproape",
        body: "Enoriașii parohiei, conectați indiferent de distanță.",
      },
    ],
    form: {
      heading: "Înscrie-ți parohia pe lista de așteptare",
      name: { label: "Nume și prenume", placeholder: "Pr. Ion Popescu", error: "Te rugăm să introduci numele." },
      parish: { label: "Parohia", placeholder: "Parohia „Sf. Nicolae”", error: "Te rugăm să introduci parohia." },
      location: {
        label: "Oraș și țară",
        placeholder: "Cluj-Napoca, România",
        error: "Te rugăm să introduci orașul și țara.",
      },
      email: {
        label: "Email",
        placeholder: "voi@parohie.ro",
        errorRequired: "Te rugăm să introduci adresa de email.",
        errorInvalid: "Adresa de email nu pare validă.",
      },
      phone: { label: "Telefon (opțional)", placeholder: "+40 7xx xxx xxx" },
      parishioners: {
        label: "Număr aproximativ de enoriași (opțional)",
        placeholder: "Alege un interval",
        options: [
          { value: "<50", label: "sub 50" },
          { value: "50-150", label: "50–150" },
          { value: "150-400", label: "150–400" },
          { value: "400+", label: "peste 400" },
        ],
      },
      submit: "Vreau Parohia Mea în parohia mea",
      submitting: "Se trimite…",
      retry: "Încearcă din nou",
      gdpr:
        "[Text GDPR de completat — ex: prin trimiterea acestui formular ești de acord cu prelucrarea datelor tale conform Regulamentului GDPR.]",
      successTitle: "Vă mulțumim, părinte.",
      successBody: "Vă vom contacta în curând.",
      errorTitle: "Ceva nu a mers bine.",
      errorBody: "Nu am putut trimite formularul. Verificați conexiunea și încercați din nou — datele introduse au rămas completate.",
    },
    footer: { contactLabel: "Contact", contactEmail: "contact@parohiamea.example" },
  },
  en: {
    header: { wordmark: "Parohia Mea", langToggleLabel: "Language" },
    hero: {
      eyebrow: "WITH THE BLESSING OF THE HIERARCH",
      hierarchPlaceholder: "[His Grace ___]",
      tagline: "Your parish, all in one place",
      description:
        "A simple app that keeps parishioners connected to parish life — announcements, the liturgical calendar, and community, all in one place.",
    },
    screenshot: {
      alt: "Screenshot of the Parohia Mea app",
      placeholderNote: "→ will be replaced with a real app screenshot",
    },
    featuresHeading: "What it offers",
    features: [
      {
        eyebrow: "FOR PARISHIONERS",
        title: "Announcements to parishioners",
        body: "Parish news and events, sent straight to their phone.",
      },
      {
        eyebrow: "CALENDAR",
        title: "Liturgical calendar",
        body: "The day's saints, fasting periods, and service times, always at hand.",
      },
      {
        eyebrow: "COMMUNITY",
        title: "Your community, close",
        body: "Parishioners connected, no matter the distance.",
      },
    ],
    form: {
      heading: "Add your parish to the waitlist",
      name: { label: "Full name", placeholder: "Fr. John Smith", error: "Please enter your name." },
      parish: { label: "Parish", placeholder: "St. Nicholas Parish", error: "Please enter your parish." },
      location: { label: "City & country", placeholder: "Chicago, USA", error: "Please enter your city and country." },
      email: {
        label: "Email",
        placeholder: "you@parish.org",
        errorRequired: "Please enter your email address.",
        errorInvalid: "That email address doesn't look valid.",
      },
      phone: { label: "Phone (optional)", placeholder: "+1 555 123 4567" },
      parishioners: {
        label: "Approximate number of parishioners (optional)",
        placeholder: "Choose a range",
        options: [
          { value: "<50", label: "under 50" },
          { value: "50-150", label: "50–150" },
          { value: "150-400", label: "150–400" },
          { value: "400+", label: "over 400" },
        ],
      },
      submit: "I want Parohia Mea in my parish",
      submitting: "Sending…",
      retry: "Try again",
      gdpr:
        "[GDPR text to be added — e.g. by submitting this form you agree to the processing of your data under GDPR.]",
      successTitle: "Thank you, Father.",
      successBody: "We'll be in touch soon.",
      errorTitle: "Something went wrong.",
      errorBody: "We couldn't submit the form. Please check your connection and try again — your entered information is still here.",
    },
    footer: { contactLabel: "Contact", contactEmail: "contact@parohiamea.example" },
  },
};
