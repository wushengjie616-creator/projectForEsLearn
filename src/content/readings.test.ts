import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  getDifficultyRationale,
  getReadingBySlug,
  readingDifficultyAssessments,
  readingLevelGuides,
  readingLevels,
  readingMaterials,
} from "./readings";

describe("reading material repository", () => {
  it("keeps the corpus manifest byte counts and hashes aligned with canonical LF source files", () => {
    const manifest = JSON.parse(readFileSync("content/corpus-manifest.json", "utf8")) as {
      items: Array<{ id: string; path: string; bytes: number; sha256: string }>;
    };

    expect(manifest.items).toHaveLength(24);
    for (const item of manifest.items) {
      const canonicalText = readFileSync(item.path, "utf8").replace(/\r\n?/g, "\n");
      const canonicalBytes = Buffer.from(canonicalText, "utf8");
      const sha256 = createHash("sha256").update(canonicalBytes).digest("hex");

      expect(canonicalBytes.byteLength, `${item.id} byte count`).toBe(item.bytes);
      expect(sha256, `${item.id} SHA-256`).toBe(item.sha256);
    }
  });

  it("stores twenty-four attributed readings with aligned Chinese translations", () => {
    expect(readingMaterials).toHaveLength(24);

    for (const material of readingMaterials) {
      expect(material.author.length).toBeGreaterThan(0);
      expect(material.source.url).toMatch(/^https:\/\//);
      expect(material.source.license.length).toBeGreaterThan(0);
      expect(material.source.retrievedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(material.source.editorialNote.length).toBeGreaterThan(10);
      expect(material.paragraphs.length).toBeGreaterThan(0);
      expect(material.paragraphs.every((paragraph) => paragraph.spanish && paragraph.chinese)).toBe(true);
      expect(material.vocabulary.length).toBeGreaterThanOrEqual(4);
      expect(material.questions.length).toBeGreaterThanOrEqual(2);
    }

    const alhambraReadings = readingMaterials.filter((material) => material.source.name === "Project Gutenberg");
    expect(alhambraReadings).toHaveLength(3);
    expect(alhambraReadings.every((material) => material.author === "Washington Irving")).toBe(true);
    expect(alhambraReadings.every((material) => material.translator === "Luis Lamarca")).toBe(true);
    expect(alhambraReadings.every((material) => material.source.url === "https://www.gutenberg.org/ebooks/52262")).toBe(true);

    const openStaxReadings = readingMaterials.filter((material) => material.source.name === "OpenStax");
    expect(openStaxReadings).toHaveLength(3);
    expect(openStaxReadings.every((material) => material.source.license === "CC BY 4.0")).toBe(true);
    expect(openStaxReadings.every((material) => material.source.requiredAttribution?.startsWith("Acceso gratuito en https://openstax.org/books/"))).toBe(true);

    const euReadings = readingMaterials.filter((material) => material.source.name === "Comisión Europea");
    expect(euReadings).toHaveLength(3);
    expect(euReadings.every((material) => material.source.license === "CC BY 4.0")).toBe(true);
    expect(euReadings.every((material) => material.source.editorialNote.includes("改动"))).toBe(true);

    const unescoReadings = readingMaterials.filter((material) => material.source.name === "UNESCO IdeasLAB");
    expect(unescoReadings).toHaveLength(1);
    expect(unescoReadings[0].source.license).toBe("CC BY-SA 3.0 IGO");
    expect(unescoReadings[0].source.derivativeNotice).toContain("no es una publicación oficial de la UNESCO");

    const quiroga = getReadingBySlug("la-abeja-haragana");
    expect(quiroga?.title).toBe("La abeja haragana");
    expect(quiroga?.author).toBe("Horacio Quiroga");
    expect(quiroga?.level).toBe("B2");
    expect(quiroga?.source.url).toBe("https://es.wikisource.org/wiki/La_abeja_haragana");
    expect(quiroga?.source.license).toBe("CC BY-SA 4.0");
    expect(quiroga?.source.editorialNote).toContain("完整原文");

    const intef = getReadingBySlug("movimiento-y-fuerza");
    expect(intef?.author).toBe("Luis García Cabello");
    expect(intef?.level).toBe("B1");
    expect(intef?.source.name).toBe("INTEF");
    expect(intef?.source.license).toBe("CC BY-SA 4.0");
    expect(intef?.source.editorialNote).toContain("完整收录正文讲解部分");

    const healthyDiet = getReadingBySlug("la-dieta-saludable");
    expect(healthyDiet?.author).toBe("Rocío Diestro Sánchez");
    expect(healthyDiet?.level).toBe("A2");
    expect(healthyDiet?.source.name).toBe("INTEF");
    expect(healthyDiet?.source.license).toBe("CC BY-SA 4.0");
    expect(healthyDiet?.source.editorialNote).toContain("学生阅读正文");

    const meals = getReadingBySlug("las-comidas-del-dia");
    expect(meals?.author).toBe("Rocío Diestro Sánchez");
    expect(meals?.level).toBe("A2");
    expect(meals?.source.name).toBe("INTEF");
    expect(meals?.source.license).toBe("CC BY-SA 4.0");
    expect(meals?.source.editorialNote).toContain("西班牙语境");

    const seasonalFoods = getReadingBySlug("los-alimentos-y-las-estaciones");
    expect(seasonalFoods?.author).toBe("Rocío Diestro Sánchez");
    expect(seasonalFoods?.level).toBe("A2");
    expect(seasonalFoods?.source.name).toBe("INTEF");
    expect(seasonalFoods?.source.license).toBe("CC BY-SA 4.0");
    expect(seasonalFoods?.source.editorialNote).toContain("地点与供应链");

    const foodHeritage = getReadingBySlug("alimentacion-y-patrimonio-inmaterial");
    expect(foodHeritage?.title).toBe("Alimentación y patrimonio inmaterial, una relación llena de sabor");
    expect(foodHeritage?.author).toBe("Lucia Iglesias Kuntz");
    expect(foodHeritage?.level).toBe("B2");
    expect(foodHeritage?.source.name).toBe("El Correo de la UNESCO");
    expect(foodHeritage?.source.license).toBe("CC BY-SA 3.0 IGO");
    expect(foodHeritage?.source.editorialNote).toContain("完整文章文字");
    expect(foodHeritage?.source.derivativeNotice).toContain("no es una publicación oficial de la UNESCO");

    const brewarrina = getReadingBySlug("trampas-para-peces-de-brewarrina");
    expect(brewarrina?.title).toBe("Trampas para peces de Brewarrina en Australia podrían ser la construcción humana más antigua del mundo");
    expect(brewarrina?.author).toBe("Kevin Rennie");
    expect(brewarrina?.translator).toBe("Antonella Clara Difalco");
    expect(brewarrina?.level).toBe("B1");
    expect(brewarrina?.source.name).toBe("Global Voices en Español");
    expect(brewarrina?.source.license).toBe("CC BY 3.0");
    expect(brewarrina?.source.editorialNote).toContain("作者叙述段");

    const congoGarden = getReadingBySlug("un-jardin-en-el-congo");
    expect(congoGarden?.title).toBe("Un Jardín en el Congo");
    expect(congoGarden?.author).toBe("Christelle X");
    expect(congoGarden?.translator).toBe("Mila Uzzi");
    expect(congoGarden?.level).toBe("A1");
    expect(congoGarden?.source.name).toBe("African Storybook");
    expect(congoGarden?.source.license).toBe("CC BY 4.0");
    expect(congoGarden?.source.editorialNote).toContain("完整故事文字");
  });

  it("looks up a reading by slug without falling back for unknown content", () => {
    expect(getReadingBySlug("la-gallina-de-los-huevos-de-oro")?.title).toBe("La gallina de los huevos de oro");
    expect(getReadingBySlug("los-dos-amigos-y-el-oso")?.title).toBe("Los dos amigos y el oso");
    expect(getReadingBySlug("contenido-inexistente")).toBeUndefined();
  });

  it("defines a complete difficulty guide and an article-specific rationale", () => {
    expect(readingLevels).toEqual(["A1", "A2", "B1", "B2"]);
    expect(Object.keys(readingLevelGuides)).toEqual(readingLevels);
    expect(Object.keys(readingDifficultyAssessments).sort()).toEqual(
      readingMaterials.map((material) => material.slug).sort(),
    );

    for (const material of readingMaterials) {
      const guide = readingLevelGuides[material.level];
      const rationale = getDifficultyRationale(material);

      expect(guide.label.length).toBeGreaterThan(0);
      expect(guide.description.length).toBeGreaterThan(10);
      expect(guide.prerequisites.length).toBeGreaterThan(10);
      expect(rationale).toContain(material.level);
      expect(rationale).toContain(String(material.minutes));
      expect(material.focus.some((focus) => rationale.includes(focus))).toBe(true);
      expect(rationale).toContain("定级依据：");
    }

    expect(getReadingBySlug("la-gallina-de-los-huevos-de-oro")?.level).toBe("A2");
    expect(getReadingBySlug("la-abeja-haragana")?.level).toBe("B2");
    expect(getReadingBySlug("alimentacion-y-patrimonio-inmaterial")?.level).toBe("B2");
  });

  it("provides at least ten unique, complete vocabulary entries per reading", () => {
    const sparseLists = readingMaterials
      .filter((material) => material.vocabulary.length < 10)
      .map((material) => `${material.slug}:${material.vocabulary.length}`);

    expect(sparseLists).toEqual([]);
    for (const material of readingMaterials) {
      expect(material.vocabulary.every((item) => item.word.trim() && item.meaning.trim())).toBe(true);
      const normalizedWords = material.vocabulary.map((item) => item.word.trim().toLocaleLowerCase("es"));
      expect(new Set(normalizedWords).size).toBe(normalizedWords.length);
    }
  });

  it("keeps every La abeja haragana study excerpt verbatim in the stored full text", () => {
    const material = getReadingBySlug("la-abeja-haragana");
    const raw = readFileSync("content/raw/quiroga/la-abeja-haragana.txt", "utf8");
    const normalizedRaw = raw.replace(/\s+/g, " ");

    expect(material).toBeDefined();
    for (const paragraph of material?.paragraphs ?? []) {
      expect(normalizedRaw).toContain(paragraph.spanish.replace(/\s+/g, " "));
    }
  });

  it("keeps every Movimiento y fuerza study excerpt verbatim in the stored source text", () => {
    const material = getReadingBySlug("movimiento-y-fuerza");
    const raw = readFileSync("content/raw/intef/movimiento-y-fuerza.txt", "utf8");
    const normalizedRaw = raw.replace(/\s+/g, " ");

    expect(material).toBeDefined();
    for (const paragraph of material?.paragraphs ?? []) {
      expect(normalizedRaw).toContain(paragraph.spanish.replace(/\s+/g, " "));
    }
  });

  it("keeps every La dieta saludable paragraph verbatim in the stored source text", () => {
    const material = getReadingBySlug("la-dieta-saludable");
    const raw = readFileSync("content/raw/intef/la-dieta-saludable.txt", "utf8");
    const normalizedRaw = raw.replace(/\s+/g, " ");

    expect(material).toBeDefined();
    for (const paragraph of material?.paragraphs ?? []) {
      expect(normalizedRaw).toContain(paragraph.spanish.replace(/\s+/g, " "));
    }
  });

  it("keeps every Las comidas del día study section verbatim in the stored source text", () => {
    const material = getReadingBySlug("las-comidas-del-dia");
    const raw = readFileSync("content/raw/intef/las-comidas-del-dia.txt", "utf8");
    const normalizedRaw = raw.replace(/\s+/g, " ");

    expect(material).toBeDefined();
    for (const paragraph of material?.paragraphs ?? []) {
      expect(normalizedRaw).toContain(paragraph.spanish.replace(/\s+/g, " "));
    }
  });

  it("keeps every seasonal-food study section verbatim in the stored source text", () => {
    const material = getReadingBySlug("los-alimentos-y-las-estaciones");
    const raw = readFileSync("content/raw/intef/los-alimentos-y-las-estaciones.txt", "utf8");
    const normalizedRaw = raw.replace(/\s+/g, " ");

    expect(material).toBeDefined();
    for (const paragraph of material?.paragraphs ?? []) {
      expect(normalizedRaw).toContain(paragraph.spanish.replace(/\s+/g, " "));
    }
  });

  it("keeps every food-heritage study section verbatim in the stored full article", () => {
    const material = getReadingBySlug("alimentacion-y-patrimonio-inmaterial");
    const raw = readFileSync("content/raw/unesco-courier/alimentacion-y-patrimonio-inmaterial.txt", "utf8");
    const normalizedRaw = raw.replace(/\s+/g, " ");

    expect(material).toBeDefined();
    for (const paragraph of material?.paragraphs ?? []) {
      expect(normalizedRaw).toContain(paragraph.spanish.replace(/\s+/g, " "));
    }
  });

  it("keeps every Brewarrina study section verbatim in the stored source excerpt", () => {
    const material = getReadingBySlug("trampas-para-peces-de-brewarrina");
    const raw = readFileSync("content/raw/global-voices/trampas-para-peces-de-brewarrina.txt", "utf8");
    const normalizedRaw = raw.replace(/\s+/g, " ");

    expect(material).toBeDefined();
    for (const paragraph of material?.paragraphs ?? []) {
      expect(normalizedRaw).toContain(paragraph.spanish.replace(/\s+/g, " "));
    }
  });

  it("keeps every Congo-garden study section verbatim in the stored full story", () => {
    const material = getReadingBySlug("un-jardin-en-el-congo");
    const raw = readFileSync("content/raw/african-storybook/un-jardin-en-el-congo.txt", "utf8");
    const normalizedRaw = raw.replace(/\s+/g, " ");

    expect(material).toBeDefined();
    for (const paragraph of material?.paragraphs ?? []) {
      expect(normalizedRaw).toContain(paragraph.spanish.replace(/\s+/g, " "));
    }
  });
});
