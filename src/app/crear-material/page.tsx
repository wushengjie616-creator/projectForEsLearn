import type { Metadata } from "next";
import Link from "next/link";

import { ArticleGenerationWorkshop } from "@/components/article-generation-workshop";
import { CustomMaterialWorkshop } from "@/components/custom-material-workshop";
import { getCurrentInviteUser } from "@/lib/auth/invite-session";

export const metadata: Metadata = {
  title: "生成个性化学习材料 | 西语拾页",
  description: "把自己的西班牙语短文转化为分级阅读、词汇、语法和写作学习材料。",
};

export default async function CreateMaterialPage() {
  const user = await getCurrentInviteUser();

  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#173b35]">
      <header className="border-b border-[#173b35]/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="font-[family-name:var(--font-serif)] text-xl font-semibold">西语拾页</Link>
          <div className="flex items-center gap-4 text-sm font-medium text-[#58726b]">
            <Link href="/mis-materiales" className="hover:text-[#173b35]">我的学习材料</Link>
            <Link href="/lecturas" className="hover:text-[#173b35]">阅读材料库</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#b24c34] uppercase">Tu texto · Tu aprendizaje</p>
        <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-serif)] text-4xl font-semibold leading-tight sm:text-5xl">把你的西语短文，变成一份读写课</h1>
        <p className="mt-5 max-w-3xl leading-8 text-[#5d746d]">选择目标等级和学习重点，DeepSeek 会按“逐段精读—词汇—语法—理解—写作”的方式生成学习材料，并保存到你的账号供以后复习。</p>
        <aside className="mt-6 max-w-3xl rounded-2xl border border-[#d2ab52]/35 bg-[#f3e4b8]/45 p-5 text-sm leading-7 text-[#536860]">
          原文和生成结果会保存在 Supabase，并发送给 DeepSeek 处理。请不要提交个人信息、未授权保密内容或敏感数据；你可以随时在“数据与空间”页面删除。
        </aside>

        <section className="mt-9">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#b24c34] uppercase">Opción 1 · AI escribe</p>
          <h2 className="mt-2 font-[family-name:var(--font-serif)] text-3xl font-semibold">让 DeepSeek 先写一篇西语短文</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#60776f]">输入你的想法或选择平台主题，先预览短文；确认满意后再转换并保存为学习材料。</p>
          <div className="mt-6"><ArticleGenerationWorkshop isAuthenticated={Boolean(user)} /></div>
        </section>

        <section className="mt-14 border-t border-[#173b35]/15 pt-12">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#b24c34] uppercase">Opción 2 · Tu texto</p>
          <h2 className="mt-2 font-[family-name:var(--font-serif)] text-3xl font-semibold">转换你已有的西语短文</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#60776f]">粘贴或上传已有原文，直接生成并保存个性化学习材料。</p>
          <div className="mt-6">
          <CustomMaterialWorkshop isAuthenticated={Boolean(user)} />
          </div>
        </section>
      </section>
    </main>
  );
}
