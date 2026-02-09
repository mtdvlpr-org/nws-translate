import type { HTMLElement } from "node-html-parser";
import type { Readable } from "node:stream";
import type { Database } from "sql.js";

import { pipeline } from "node:stream/promises";
import { inflate } from "pako";
import unzipper from "unzipper";

/**
 * Extracts the database from a .jwpub file using streaming.
 *
 * @param stream The readable stream of the .jwpub file.
 * @returns The loaded database.
 */
export const getJWPUBDatabase = async (stream: Readable): Promise<Database> => {
  try {
    const dbBuffer = await pipeline(
      stream,
      unzipper.ParseOne(/^contents$/),
      unzipper.ParseOne(/\.db$/),
      async (stream) => {
        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
          chunks.push(Buffer.from(chunk));
        }
        return Buffer.concat(chunks);
      },
    );

    // Load the database
    return loadDatabase(new Uint8Array(dbBuffer));
  } catch (e) {
    console.error("Error extracting database:", e);
    throw createError({
      cause: e,
      message: "Failed to get database from .jwpub file",
      statusCode: 500,
    });
  }
};

export const parseJWPUB = async (db: Database) => {
  const htmlDocs = await getHTMLDocs(db);
  return htmlDocs.map((htmlDoc) => {
    // "Nr. {nr} {title}"
    let header = htmlDoc.querySelector("header > h1 strong")?.textContent;

    // Fallback for old format
    if (!header) {
      htmlDoc.querySelectorAll("p.st > strong").forEach((s) => {
        if (s.textContent?.includes("Nr.")) {
          header = s.textContent;
        }
      });
    }

    if (!header) {
      throw createError({
        message: "No header found for: " + htmlDoc.toString(),
        status: 400,
      });
    }

    if (!header.includes("Nr.")) {
      throw createError({
        message: "Invalid header: " + header,
        status: 400,
      });
    }

    const [, numberStr, ...titleParts] = header.split(/\s+/);
    const title = titleParts.join(" ");
    const number = parseInt(numberStr || "0");

    if (!numberStr || isNaN(number)) {
      throw createError({
        message: `Invalid number (${numberStr}) for header: ${header}`,
        status: 400,
      });
    }

    const paragraphs = htmlDoc.querySelectorAll("div > p");
    let updatedStr = paragraphs[paragraphs.length - 1]?.textContent;

    // Fallback for old format
    if (!updatedStr) {
      const oldUpdated = htmlDoc.querySelector("p.st > strong")?.textContent;

      const [month, year] = oldUpdated?.split(" ") ?? [];

      if (month && year) {
        const MONTHS = {
          April: 4,
          Augustus: 8,
          December: 12,
          Februari: 2,
          Januari: 1,
          Juli: 7,
          Juni: 6,
          Maart: 3,
          Mei: 5,
          November: 11,
          Oktober: 10,
          September: 9,
        };
        const monthNr = MONTHS[month as keyof typeof MONTHS];
        const yearNr = year?.slice(2);
        if (monthNr && yearNr && !isNaN(parseInt(yearNr))) {
          updatedStr = `S-34-O Nr. ${number} ${monthNr}/${yearNr}`;
        }
      }
    }

    if (!updatedStr) {
      throw createError({
        message: "No updated string found for: " + header,
        status: 400,
      });
    }

    if (!updatedStr.includes("Nr.")) {
      throw createError({
        message: "Invalid updated string: " + updatedStr,
        status: 400,
      });
    }

    updatedStr = updatedStr
      // eslint-disable-next-line security/detect-unsafe-regex
      .replace(/^(S-34-O\s*)?Nr\.\s*\d+(-O)?\s*/, "")
      .trim();

    const [original, , revised] = updatedStr.split(/\s+/);
    const updated = updatedStr.includes("herzien") ? revised : original;

    if (!updated) {
      throw createError({
        message: "No updated date found for: " + updatedStr,
        status: 400,
      });
    }

    if (!/^\d{1,2}\/\d{2}$/.test(updated)) {
      throw createError({
        message: `Invalid updated date (${updated}): ` + updatedStr,
        status: 400,
      });
    }

    return { number, title, updated };
  });
};

const hexToBytes = (hex: string) => {
  const clean = hex.replace(/[^a-fA-F0-9]/g, "");
  const bytes = new Uint8Array(clean.length / 2);

  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }

  return bytes;
};

const bufferToHex = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);

  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const generateSHA256Rounds = async (text: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return bufferToHex(hashBuffer);
};

const xorBuffers = (buf1: Uint8Array, buf2: Uint8Array) => {
  if (buf1.length !== buf2.length) {
    throw createError({
      message: "Buffers must be same length",
      status: 400,
    });
  }

  return buf1.map((byte, i) => byte ^ buf2[i % buf2.length]!);
};

const bytesToHex = (bytes: Uint8Array) => {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
};

const hashAndXor = async (inputText: string, xorKeyHex: string) => {
  const hashHex = await generateSHA256Rounds(inputText);
  const hashBytes = hexToBytes(hashHex);
  const keyBytes = hexToBytes(xorKeyHex);

  const xored = xorBuffers(hashBytes, keyBytes);
  return bytesToHex(xored);
};

const decryptAES128CBC = async (
  data: BufferSource,
  key: string,
  iv: string,
) => {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    hexToBytes(key),
    { name: "AES-CBC" },
    false,
    ["decrypt"],
  );

  const decrypted = await crypto.subtle.decrypt(
    { iv: hexToBytes(iv), name: "AES-CBC" },
    cryptoKey,
    data,
  );
  return decrypted;
};

const getRawContent = async (data: BufferSource, key: string, iv: string) => {
  const decryptedContent = await decryptAES128CBC(data, key, iv);

  const compressed = new Uint8Array(decryptedContent);
  const decompressed = inflate(compressed);
  const text = new TextDecoder().decode(decompressed);

  return text;
};

const getPubCard = (db: Database) => {
  const publicationTable = db.exec(
    "SELECT MepsLanguageIndex, Symbol, Year FROM Publication",
  );

  if (publicationTable.length === 0) {
    throw createError({
      message: "The file selected is not a valid JWPUB file.",
      status: 400,
    });
  }

  return publicationTable[0]?.values[0]?.join("_") ?? "";
};

const getPubKeyIv = async (pubCard: string) => {
  const { jwpubKey } = useRuntimeConfig();
  const key = atob(jwpubKey);

  const pubHashKey = await hashAndXor(pubCard, key);

  return { iv: pubHashKey.slice(32), key: pubHashKey.slice(0, 32) };
};

const getDocs = async (db: Database, key: string, iv: string) => {
  const files: HTMLElement[] = [];

  const data = db.exec(`SELECT Content FROM Document`);

  for (const row of data.at(0)!.values) {
    const content = row.at(0) as BufferSource;
    const text = await getRawContent(content, key, iv);
    const htmlDoc = parseHTML(text);

    htmlDoc.querySelectorAll("rt").forEach((rt) => rt.remove());

    files.push(htmlDoc);
  }

  return files;
};

const getHTMLDocs = async (db: Database) => {
  const pubCard = getPubCard(db);

  const { iv, key } = await getPubKeyIv(pubCard);

  const files = await getDocs(db, key, iv);
  return files;
};
