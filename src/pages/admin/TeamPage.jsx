import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2, UserPlus, X } from "lucide-react";
import {
  createTeamMember,
  deleteTeamMember,
  fetchTeam,
  updateTeamMember,
} from "../../lib/adminApi";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useAdminAuth } from "../../context/AdminAuthContext";
import {
  ErrorState,
  Field,
  GhostButton,
  Panel,
  PrimaryButton,
  Spinner,
  StatusBadge,
  TableWrap,
  Td,
  Th,
} from "../../components/admin/ui";

const BLANK = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  role: "manager",
  is_active: true,
};

export default function TeamPage() {
  const { admin: currentAdmin } = useAdminAuth();
  const fetcher = useCallback((signal) => fetchTeam(signal), []);
  const { data, status, error, reload } = useAsyncData(fetcher);

  const [editing, setEditing] = useState(null); // null | "new" | admin object
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const openNew = () => {
    setForm(BLANK);
    setErrors({});
    setEditing("new");
  };

  const openEdit = (member) => {
    setForm({
      name: member.name,
      email: member.email,
      password: "",
      password_confirmation: "",
      role: member.role,
      is_active: member.is_active,
    });
    setErrors({});
    setEditing(member);
  };

  const close = () => {
    setEditing(null);
    setErrors({});
  };

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
      if (editing === "new") {
        await createTeamMember(form);
        toast.success("Team member added.");
      } else {
        // An empty password field means "leave the password alone".
        const payload = { ...form };
        if (!payload.password) {
          delete payload.password;
          delete payload.password_confirmation;
        }
        await updateTeamMember(editing.id, payload);
        toast.success("Team member updated.");
      }
      close();
      reload();
    } catch (err) {
      setErrors(err.errors ?? {});
      if (!Object.keys(err.errors ?? {}).length) toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (member) => {
    if (!window.confirm(`Remove ${member.name} from the team?`)) return;

    try {
      const result = await deleteTeamMember(member.id);
      toast.success(result.message);
      reload();
    } catch (err) {
      toast.error(err.errors?.admin ?? err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl">Team</h1>
          <div className="hairline mt-4" />
        </div>
        <PrimaryButton onClick={openNew}>
          <UserPlus size={15} /> Add member
        </PrimaryButton>
      </div>

      {editing && (
        <Panel
          title={editing === "new" ? "New team member" : `Edit ${editing.name}`}
          action={
            <button onClick={close} className="p-1 text-cream/40 hover:text-gold" aria-label="Close">
              <X size={16} />
            </button>
          }
          bodyClass="p-5"
        >
          <form onSubmit={submit} noValidate className="grid gap-5 md:grid-cols-2">
            <Field label="Name" error={errors.name}>
              <input value={form.name} onChange={(e) => set({ name: e.target.value })} required />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set({ email: e.target.value })}
                required
              />
            </Field>
            <Field
              label="Password"
              error={errors.password}
              hint={editing === "new" ? "At least 8 characters." : "Leave blank to keep the current password."}
            >
              <input
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => set({ password: e.target.value })}
              />
            </Field>
            <Field label="Confirm password">
              <input
                type="password"
                autoComplete="new-password"
                value={form.password_confirmation}
                onChange={(e) => set({ password_confirmation: e.target.value })}
              />
            </Field>
            <Field label="Role" error={errors.role}>
              <select value={form.role} onChange={(e) => set({ role: e.target.value })}>
                <option value="manager">Manager — runs the shop</option>
                <option value="owner">Owner — also manages the team</option>
              </select>
            </Field>
            <Field label="Status" error={errors.is_active}>
              <label className="flex h-[46px] cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => set({ is_active: e.target.checked })}
                  className="h-4 w-4 accent-[#c9a34a]"
                />
                Active — can sign in
              </label>
            </Field>
            <div className="flex gap-3 md:col-span-2">
              <PrimaryButton type="submit" loading={saving}>
                {saving ? "Saving" : "Save member"}
              </PrimaryButton>
              <GhostButton type="button" onClick={close}>
                Cancel
              </GhostButton>
            </div>
          </form>
        </Panel>
      )}

      <Panel>
        {status === "loading" && <Spinner label="Loading team" />}
        {status === "error" && <ErrorState message={error} onRetry={reload} />}

        {status === "ready" && (
          <TableWrap>
            <thead className="border-b border-cream/10">
              <tr>
                <Th>Name</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                <Th>Last sign-in</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream/5">
              {data.data.map((member) => (
                <tr key={member.id} className="transition-colors hover:bg-cream/5">
                  <Td>
                    <p>
                      {member.name}
                      {member.id === currentAdmin?.id && (
                        <span className="ml-2 text-xs text-cream/30">(you)</span>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-cream/30">{member.email}</p>
                  </Td>
                  <Td>
                    <StatusBadge status={member.role} />
                  </Td>
                  <Td>
                    <StatusBadge status={member.is_active ? "active" : "inactive"} />
                  </Td>
                  <Td className="text-xs text-cream/40">
                    {member.last_login_at
                      ? new Date(member.last_login_at).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Never"}
                  </Td>
                  <Td>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(member)}
                        className="p-2 text-cream/50 transition-colors hover:text-gold"
                        aria-label={`Edit ${member.name}`}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => remove(member)}
                        disabled={member.id === currentAdmin?.id}
                        className="p-2 text-cream/50 transition-colors hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-25"
                        aria-label={`Remove ${member.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
      </Panel>

      <p className="text-xs text-cream/30">
        The last active owner cannot be demoted, deactivated, or deleted — someone always keeps the keys.
      </p>
    </div>
  );
}
