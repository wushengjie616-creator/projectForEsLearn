import Link from "next/link";
import { redirect } from "next/navigation";

import { hasActiveInviteUsers } from "@/lib/auth/invite-registry";
import { getCurrentInviteUser, isInviteSessionConfigured } from "@/lib/auth/invite-session";

import { login } from "./actions";

type LoginPageProps = { searchParams: Promise<{ error?: string; message?: string }> };

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (await getCurrentInviteUser()) redirect("/lecturas");
  const params = await searchParams;
  const configured = hasActiveInviteUsers() && isInviteSessionConfigured();
  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f0e8] px-5 text-[#173b35]">
      <section className="w-full max-w-md rounded-[2rem] border border-[#173b35]/10 bg-white/75 p-7 shadow-xl sm:p-9">
        <Link href="/" className="font-[family-name:var(--font-serif)] text-xl font-semibold">西语拾页</Link>
        <p className="mt-8 text-xs font-semibold tracking-[0.18em] text-[#b24c34] uppercase">仅限受邀用户</p>
        <h1 className="mt-2 font-[family-name:var(--font-serif)] text-3xl font-semibold">输入邀请码继续学习</h1>
        <p className="mt-3 text-sm leading-7 text-[#61766f]">无需邮箱或密码。每位学习者使用管理员单独生成的个人邀请码，学习进度彼此独立。</p>
        {!configured && <p className="mt-5 rounded-xl bg-[#f8e5de] p-4 text-sm text-[#923f2c]">邀请码登录尚未配置，请联系管理员。</p>}
        {params.error && <p className="mt-5 rounded-xl bg-[#f8e5de] p-4 text-sm text-[#923f2c]">{params.error}</p>}
        {params.message && <p className="mt-5 rounded-xl bg-[#e2efe9] p-4 text-sm text-[#315f52]">{params.message}</p>}
        <form className="mt-7 space-y-4">
          <label className="block text-sm font-medium">邀请码<input name="inviteCode" type="text" required autoComplete="off" spellCheck={false} placeholder="ES-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX" className="mt-2 w-full rounded-xl border border-[#173b35]/15 bg-white px-4 py-3 font-mono tracking-wide uppercase outline-none focus:border-[#b24c34]" /></label>
          <button disabled={!configured} formAction={login} className="w-full rounded-full bg-[#173b35] px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">登录</button>
        </form>
        <p className="mt-5 text-xs leading-6 text-[#71867f]">请妥善保存邀请码；任何持有者都能访问该邀请码对应的学习进度。邀请码遗失或泄露时请联系管理员更换。</p>
      </section>
    </main>
  );
}
