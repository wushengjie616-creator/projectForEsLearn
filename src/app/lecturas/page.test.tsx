import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ReadingLibraryPage from "./page";

describe("reading library page", () => {
  it("lists every stored reading with a working detail link", () => {
    const html = renderToStaticMarkup(createElement(ReadingLibraryPage));

    expect(html).toContain("阅读材料库");
    expect(html).toContain("La gallina de los huevos de oro");
    expect(html).toContain("El cuervo y el zorro");
    expect(html).toContain("La lechera");
    expect(html).toContain("El león y el ratón");
    expect(html).toContain("Los dos amigos y el oso");
    expect(html).toContain("La zorra y la gallina");
    expect(html).toContain("Gobierno de la Alhambra");
    expect(html).toContain("Tradiciones locales");
    expect(html).toContain("La Casa del Gallo");
    expect(html).toContain("La química en la vida cotidiana");
    expect(html).toContain("Modelos, teorías y leyes científicas");
    expect(html).toContain("Procesos espontáneos y no espontáneos");
    expect(html).toContain("El Pacto Verde Europeo");
    expect(html).toContain("Protección del medio ambiente e innovación");
    expect(html).toContain("Cómo funciona la política agrícola de la UE");
    expect(html).toContain("La IA y el significado de la literatura");
    expect(html).toContain("La abeja haragana");
    expect(html).toContain("Movimiento y fuerza");
    expect(html).toContain("La dieta saludable");
    expect(html).toContain("Las comidas del día");
    expect(html).toContain("Los alimentos y las estaciones");
    expect(html).toContain("Alimentación y patrimonio inmaterial, una relación llena de sabor");
    expect(html).toContain("Trampas para peces de Brewarrina en Australia");
    expect(html).toContain("Un Jardín en el Congo");
    expect(html).toContain('href="/lecturas/la-gallina-de-los-huevos-de-oro"');
  });

  it("groups the library by difficulty and explains each level", () => {
    const html = renderToStaticMarkup(createElement(ReadingLibraryPage));

    expect(html).toContain("A1 · 入门短句");
    expect(html).toContain("A2 · 基础叙事");
    expect(html).toContain("B1 · 中级阅读");
    expect(html).toContain("B2 · 中高级研读");
    expect(html).toContain("学习前提");
    expect(html).toContain("本站建议的支架阅读等级");
  });
});
