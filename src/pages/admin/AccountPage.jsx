import { useState } from "react";
import toast from "react-hot-toast";
import { KeyRound } from "lucide-react";
import { adminUpdatePassword } from "../../lib/adminApi";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { Field, Panel, PrimaryButton, StatusBadge } from "../../components/admin/ui";

const BLANK = { current_password: "", password: "", password_confirmation: "" };

export default function AccountPage() {
  const { admin } = useAdminAuth();
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (patch) => {
    setForm((f) => ({ ...f, ...patch }));
    setErrors((e) => {
      const next = { ...e };
      Object.keys(patch).forEach((key) => delete next[key]);
      return next;
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setErrors({});

    try {
      await adminUpdatePassword(form);
      setForm(BLANK);
      toast.success("Password updated. Other devices have been signed out.");
    } catch (err) {
      setErrors(err.errors ?? {});
      if (!Object.keys(err.errors ?? {}).length) toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl md:text-4xl">Account</h1>
        <div className="hairline mt-4" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Your details" bodyClass="p-5">
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-cream/40">Name</dt>
              <dd className="mt-1">{admin?.name}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-cream/40">Email</dt>
              <dd className="mt-1">{admin?.email}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-cream/40">Role</dt>
              <dd className="mt-1">
                <StatusBadge status={admin?.role} />
              </dd>
            </div>
          </dl>
        </Panel>

        <Panel title="Change password" bodyClass="p-5">
          <form onSubmit={submit} noValidate className="space-y-5">
            <Field label="Current password" error={errors.current_password}>
              <input
                type="password"
                autoComplete="current-password"
                value={form.current_password}
                onChange={(e) => set({ current_password: e.target.value })}
                required
              />
            </Field>
            <Field label="New password" error={errors.password} hint="At least 8 characters.">
              <input
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => set({ password: e.target.value })}
                required
              />
            </Field>
            <Field label="Confirm new password">
              <input
                type="password"
                autoComplete="new-password"
                value={form.password_confirmation}
                onChange={(e) => set({ password_confirmation: e.target.value })}
                required
              />
            </Field>
            <PrimaryButton type="submit" loading={saving}>
              <KeyRound size={15} /> {saving ? "Updating" : "Update password"}
            </PrimaryButton>
          </form>
        </Panel>
      </div>
    </div>
  );
}
