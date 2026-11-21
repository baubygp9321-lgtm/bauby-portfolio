import { describe, expect, it } from "vitest";
import { FALLBACK, LIST_KEYS, normalizePortfolio, resolvePortfolio, validatePortfolio } from "./portfolio";

// Any phone-like run of 8+ digits (spaces/dashes allowed). Deliberately contains no real number.
const PHONE_DIGITS = /\+?\d[\d\s-]{6,}\d/;

/** Shape of the row the live site returned before this change (contents mirror the public page). */
const liveLikeRow = {
  name: "Bauby Gupta",
  headline: "Founder & CEO, QySoul",
  about: "Founder & CEO of QySoul. Add your verified professional introduction from the Admin Dashboard.",
  skills: [],
  research: [],
  exploring: [],
  projects: [{ title: "QySoul", status: "Live", desc: "A deployed MERN + TypeScript application.", url: "https://qy-soul.vercel.app/" }],
  avatarUrl: "",
  cvUrl: "",
  contact: { email: "owner@example.com", phone: "", location: "Kutani Road Panipat Haryana" },
};

describe("built-in defaults (privacy)", () => {
  it("contain no phone number anywhere", () => {
    expect(FALLBACK.contact.phone).toBe("");
    expect(JSON.stringify(FALLBACK)).not.toMatch(PHONE_DIGITS);
  });

  it("render no phone number when the database row is missing entirely", () => {
    for (const raw of [undefined, null, {}]) {
      const { data } = resolvePortfolio(raw);
      expect(data.contact.phone).toBe("");
      expect(JSON.stringify(data)).not.toMatch(PHONE_DIGITS);
    }
  });
});

describe("contact fields", () => {
  const cases: [string, unknown, string][] = [
    ["missing key", undefined, "default"],
    ["null", null, "default"],
    ["empty string", "", ""],
    ["whitespace-only string", "   \t ", ""],
    ["real value (trimmed)", "  Panipat  ", "Panipat"],
  ];

  for (const field of ["email", "phone", "location"] as const) {
    describe(field, () => {
      it.each(cases)("%s", (_label, stored, expected) => {
        const contact: Record<string, unknown> = { email: "a@b.co", phone: "+1 555", location: "X" };
        if (stored === undefined) delete contact[field];
        else contact[field] = stored;
        const { data } = resolvePortfolio({ contact });
        expect(data.contact[field]).toBe(expected === "default" ? FALLBACK.contact[field] : expected);
      });
    });
  }

  it("a stored blank phone stays hidden and is never refilled", () => {
    const { data } = resolvePortfolio({ contact: { email: "a@b.co", phone: "", location: "" } });
    expect(data.contact).toEqual({ email: "a@b.co", phone: "", location: "" });
  });

  it("missing / null contact object falls back to defaults (which have no phone)", () => {
    for (const contact of [undefined, null]) {
      const { data, sources } = resolvePortfolio(contact === undefined ? {} : { contact });
      expect(data.contact).toEqual(FALLBACK.contact);
      expect(sources.contact).toBe("default");
    }
  });

  it("a stored phone number is shown (database takes priority)", () => {
    expect(resolvePortfolio({ contact: { phone: "+91 99999 00000" } }).data.contact.phone).toBe("+91 99999 00000");
  });

  it("non-string values are treated as missing", () => {
    expect(resolvePortfolio({ contact: { phone: 12345 } }).data.contact.phone).toBe(FALLBACK.contact.phone);
  });
});

describe("lists", () => {
  for (const key of LIST_KEYS) {
    describe(key, () => {
      it("missing -> built-in defaults", () => {
        const r = resolvePortfolio({});
        expect(r.data[key]).toEqual(FALLBACK[key]);
        expect(r.sources[key]).toBe("default");
      });
      it("null -> built-in defaults", () => {
        expect(resolvePortfolio({ [key]: null }).data[key]).toEqual(FALLBACK[key]);
      });
      it("non-array (string) -> built-in defaults", () => {
        expect(resolvePortfolio({ [key]: "oops" }).data[key]).toEqual(FALLBACK[key]);
      });
      it("explicit [] stays empty", () => {
        const r = resolvePortfolio({ [key]: [] });
        expect(r.data[key]).toEqual([]);
        expect(r.sources[key]).toBe("database");
      });
      it("stored items win and are NOT merged with defaults", () => {
        const r = resolvePortfolio({ [key]: [{ title: "Only", desc: "Mine" }] });
        expect(r.data[key]).toEqual([{ title: "Only", desc: "Mine" }]);
      });
    });
  }

  it("invalid items are dropped; an array of only invalid items resolves to []", () => {
    expect(resolvePortfolio({ skills: [null, 3, {}, { title: "  ", desc: "" }] }).data.skills).toEqual([]);
    expect(resolvePortfolio({ skills: [null, { title: "A", desc: "B" }] }).data.skills).toEqual([{ title: "A", desc: "B" }]);
  });

  it("roles and socials follow the same rule", () => {
    expect(resolvePortfolio({}).data.roles).toEqual(FALLBACK.roles);
    expect(resolvePortfolio({ roles: null }).data.roles).toEqual(FALLBACK.roles);
    expect(resolvePortfolio({ roles: [] }).data.roles).toEqual([]);
    expect(resolvePortfolio({ roles: ["  ", ""] }).data.roles).toEqual([]);
    expect(resolvePortfolio({ socials: [] }).data.socials).toEqual([]);
    expect(resolvePortfolio({ socials: [{ label: "GitHub", url: "https://github.com/x" }] }).data.socials).toHaveLength(1);
  });
});

describe("core profile text (must not render blank)", () => {
  it.each([
    ["missing", undefined],
    ["null", null],
    ["empty string", ""],
    ["whitespace-only", "   "],
  ])("%s name/headline/tagline/about -> built-in default", (_l, v) => {
    const raw = v === undefined ? {} : { name: v, headline: v, tagline: v, about: v };
    const { data } = resolvePortfolio(raw);
    expect(data.name).toBe(FALLBACK.name);
    expect(data.headline).toBe(FALLBACK.headline);
    expect(data.tagline).toBe(FALLBACK.tagline);
    expect(data.about).toBe(FALLBACK.about);
  });

  it("legacy placeholder about is treated as unset", () => {
    expect(resolvePortfolio({ about: liveLikeRow.about }).data.about).toBe(FALLBACK.about);
  });

  it("stored text wins", () => {
    expect(resolvePortfolio({ name: "  Someone  " }).data.name).toBe("Someone");
  });

  it("blank avatar / CV mean 'none'", () => {
    const { data } = resolvePortfolio({ avatarUrl: "  ", cvUrl: null });
    expect(data.avatarUrl).toBe("");
    expect(data.cvUrl).toBe("");
  });
});

describe("live-like row (backward compatibility)", () => {
  const { data, sources } = resolvePortfolio(liveLikeRow);

  it("explicitly empty lists stay hidden", () => {
    expect(data.skills).toEqual([]);
    expect(data.research).toEqual([]);
    expect(data.exploring).toEqual([]);
  });
  it("stored projects are used as-is", () => {
    expect(data.projects.map((p) => p.title)).toEqual(["QySoul"]);
  });
  it("fields that did not exist in the old shape use defaults", () => {
    expect(sources.journey).toBe("default");
    expect(sources.roles).toBe("default");
    expect(data.journey.length).toBeGreaterThan(0);
  });
  it("stored contact values are preserved, blank phone hidden", () => {
    expect(data.contact).toEqual({ email: "owner@example.com", phone: "", location: "Kutani Road Panipat Haryana" });
  });
  it("never crashes on malformed rows", () => {
    for (const raw of [null, [], "x", 42, { contact: "x", skills: {} }]) {
      expect(() => resolvePortfolio(raw)).not.toThrow();
    }
  });
});

describe("admin save path", () => {
  it("normalise + resolve round-trips blank contact fields and empty lists unchanged", () => {
    const draft = { ...resolvePortfolio(liveLikeRow).data, contact: { email: "a@b.co", phone: "  ", location: "" } };
    const saved = normalizePortfolio(draft);
    expect(saved.contact).toEqual({ email: "a@b.co", phone: "", location: "" });
    const reloaded = resolvePortfolio(JSON.parse(JSON.stringify(saved))).data;
    expect(reloaded.contact.phone).toBe("");
    expect(reloaded.skills).toEqual([]);
  });

  it("validation still blocks bad URLs and missing titles", () => {
    const d = normalizePortfolio({ ...FALLBACK, projects: [{ title: "", desc: "d", url: "ftp://x" }] });
    expect(validatePortfolio(d)).toHaveLength(2);
  });

  it("blank email is allowed (it simply hides the email + form)", () => {
    expect(validatePortfolio(normalizePortfolio({ ...FALLBACK, contact: { email: "", phone: "", location: "" } }))).toEqual([]);
  });
});
