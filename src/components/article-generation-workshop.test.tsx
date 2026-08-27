import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  ArticleDraftConversion,
  ArticleGenerationWorkshop,
} from "./article-generation-workshop";

describe("ArticleGenerationWorkshop", () => {
  it("offers either a predefined topic or a learner idea with CEFR control and consent", () => {
    const html = renderToStaticMarkup(<ArticleGenerationWorkshop isAuthenticated />);

    expect(html).toContain('name="articleSourceMode"');
    expect(html).toContain("选择平台主题");
    expect(html).toContain("输入我的想法");
    expect(html).toContain("日常生活");
    expect(html).toContain("环境与生活");
    expect(html).toContain("目标等级");
    expect(html).toContain("发送给 DeepSeek");
    expect(html).toContain("先生成西班牙语短文");
  });

  it("does not expose the paid form to unauthenticated visitors", () => {
    const html = renderToStaticMarkup(<ArticleGenerationWorkshop isAuthenticated={false} />);

    expect(html).toContain("登录受邀账号后使用");
    expect(html).not.toContain("先生成西班牙语短文</button>");
  });
});

describe("ArticleDraftConversion", () => {
  it("previews the draft and makes material conversion a separate user action", () => {
    const html = renderToStaticMarkup(
      <ArticleDraftConversion
        article={{
          titleEs: "Un huerto en la azotea",
          text: "Clara prepara un huerto con sus vecinos.\n\nCada sabado cuidan las plantas juntos.",
          level: "A2",
        }}
      />,
    );

    expect(html).toContain("Un huerto en la azotea");
    expect(html).toContain('data-spanish-word="Clara"');
    expect(html).toContain('data-spanish-word="prepara"');
    expect(html).toContain("草稿尚未保存");
    expect(html).toContain("学习重点");
    expect(html).toContain("转换并保存为学习材料");
  });
});
