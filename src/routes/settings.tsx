import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { removeAccount, setActiveAccount, useAccounts } from "@/lib/account";
import { clearHistory, useHistory } from "@/lib/history";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "الإعدادات — IPTV سمارت" },
      { name: "description", content: "أدر اشتراكاتك وبدّل بينها وامسح سجل المشاهدة." },
      { property: "og:title", content: "الإعدادات — IPTV سمارت" },
      { property: "og:description", content: "إدارة الاشتراكات وسجل المشاهدة." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { accounts, activeId } = useAccounts();
  const history = useHistory();

  return (
    <AppShell>
      <h1 className="mb-6 text-2xl font-black md:text-3xl">الإعدادات</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">الاشتراكات</h2>
        {accounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">لا توجد اشتراكات مضافة.</p>
        ) : (
          accounts.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 rounded-xl bg-surface p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{a.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {a.server} · {a.username}
                </p>
              </div>
              {a.id === activeId ? (
                <span className="inline-flex items-center gap-1 rounded-lg bg-primary/20 px-3 py-1 text-xs font-bold text-primary">
                  <Check className="size-3" /> نشط
                </span>
              ) : (
                <button
                  onClick={() => setActiveAccount(a.id)}
                  className="rounded-lg bg-background px-3 py-1.5 text-xs font-semibold"
                >
                  تفعيل
                </button>
              )}
              <button
                onClick={() => removeAccount(a.id)}
                className="grid size-9 place-items-center rounded-lg bg-background text-destructive"
                aria-label="حذف"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))
        )}
        <Link
          to="/login"
          className="inline-block rounded-xl gradient-accent px-5 py-3 font-bold text-primary-foreground"
        >
          إضافة اشتراك جديد
        </Link>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-bold">سجل المشاهدة</h2>
        <p className="text-sm text-muted-foreground">{history.length} عنصر محفوظ على هذا الجهاز.</p>
        <button
          onClick={() => clearHistory()}
          className="rounded-xl bg-surface px-5 py-3 text-sm font-semibold text-destructive"
        >
          مسح السجل
        </button>
      </section>
    </AppShell>
  );
}
