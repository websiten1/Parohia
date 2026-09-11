import { randomInt } from "node:crypto";
import { prisma } from "@/lib/db";

/**
 * Codes get read aloud and typed from a paper notice, so the alphabet drops
 * every pair that looks alike in print: no O or 0, no I, 1 or L, no U or V.
 */
const ALPHABET = "ABCDEFGHJKMNPQRSTWXYZ23456789";
const CODE_LENGTH = 8;

function randomCode(): string {
  let out = "";
  for (let i = 0; i < CODE_LENGTH; i += 1) out += ALPHABET[randomInt(0, ALPHABET.length)];
  return out;
}

/** Retries on the astronomically unlikely collision rather than assuming. */
export async function generateJoinCode(): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = randomCode();
    const taken = await prisma.parish.findUnique({ where: { joinCode: code }, select: { id: true } });
    if (!taken) return code;
  }
  throw new Error("Could not allocate a unique parish join code.");
}

const slugify = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "parohie";

/** Appends -2, -3 and so on until the slug is free. */
export async function generateParishSlug(name: string): Promise<string> {
  const base = slugify(name);
  for (let n = 1; n < 200; n += 1) {
    const candidate = n === 1 ? base : `${base}-${n}`;
    const taken = await prisma.parish.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!taken) return candidate;
  }
  throw new Error("Could not allocate a unique parish slug.");
}

/**
 * Article slugs are unique per parish, not globally, so two parishes may both
 * publish "programul-de-craciun". `exceptId` lets an edit keep its own slug.
 */
export async function generateArticleSlug(
  parishId: string,
  source: string,
  exceptId?: string,
): Promise<string> {
  const base = slugify(source);
  for (let n = 1; n < 200; n += 1) {
    const candidate = n === 1 ? base : `${base}-${n}`;
    const taken = await prisma.article.findUnique({
      where: { parishId_slug: { parishId, slug: candidate } },
      select: { id: true },
    });
    if (!taken || taken.id === exceptId) return candidate;
  }
  throw new Error("Could not allocate a unique article slug.");
}
