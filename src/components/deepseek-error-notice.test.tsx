import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { DeepSeekErrorNotice } from "./deepseek-error-notice";

describe("DeepSeekErrorNotice", () => {
  it("shows the official top-up link only for the insufficient-balance code", () => {
    const balanceHtml = renderToStaticMarkup(
      <DeepSeekErrorNotice
        message="DeepSeek API 余额不足"
        code="deepseek_insufficient_balance"
      />,
    );
    const genericHtml = renderToStaticMarkup(
      <DeepSeekErrorNotice message="服务暂时不可用" code="provider_unavailable" />,
    );

    expect(balanceHtml).toContain('href="https://platform.deepseek.com/top_up"');
    expect(balanceHtml).toContain("前往 DeepSeek 充值");
    expect(balanceHtml).toContain("若你不是平台账户管理员");
    expect(genericHtml).not.toContain("platform.deepseek.com");
  });

  it("keeps the existing storage-management action separate from billing", () => {
    const html = renderToStaticMarkup(
      <DeepSeekErrorNotice message="空间不足" manageStorageHref="/mis-datos" />,
    );

    expect(html).toContain('href="/mis-datos"');
    expect(html).toContain("管理存储空间");
    expect(html).not.toContain("DeepSeek 充值");
  });
});
