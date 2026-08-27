import Link from "next/link";

import {
  DEEPSEEK_INSUFFICIENT_BALANCE_CODE,
  DEEPSEEK_TOP_UP_URL,
} from "@/lib/deepseek/provider-error";

export function DeepSeekErrorNotice({ message, code, manageStorageHref }: {
  message: string;
  code?: string;
  manageStorageHref?: string;
}) {
  const balanceExhausted = code === DEEPSEEK_INSUFFICIENT_BALANCE_CODE;
  return (
    <div role="alert" className="rounded-xl bg-[#f8e5de] p-4 text-sm leading-6 text-[#923f2c]">
      <p>{message}</p>
      <div className="mt-2 flex flex-wrap gap-3 font-semibold">
        {balanceExhausted && (
          <a
            href={DEEPSEEK_TOP_UP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            前往 DeepSeek 充值
          </a>
        )}
        {manageStorageHref && (
          <Link href={manageStorageHref} className="underline underline-offset-4">
            管理存储空间
          </Link>
        )}
      </div>
      {balanceExhausted && (
        <p className="mt-2 text-xs font-normal">
          若你不是平台账户管理员，请联系管理员处理；给其他 DeepSeek 账号充值不会恢复本平台服务。
        </p>
      )}
    </div>
  );
}
