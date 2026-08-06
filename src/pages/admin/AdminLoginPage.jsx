import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { Field, PrimaryButton, Spinner } from "../../components/admin/ui";

export default function AdminLoginPage() {
  const { login, authenticated, checking } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <Spinner label="Checking your session" />
      </div>
    );
  }

  if (authenticated) {
    return <Navigate to={location.state?.from?.pathname ?? "/admin"} replace />;
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setErrors({});

    try {
      const admin = await login(form);
      toast.success(`Welcome back, ${admin.name.split(" ")[0]}.`);
      navigate(location.state?.from?.pathname ?? "/admin", { replace: true });
    } catch (error) {
      setErrors(error.errors ?? {});
      if (!Object.keys(error.errors ?? {}).length) toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5 py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link to="/" className="font-display text-2xl">
            AKP <span className="gold-text italic">Luxury Hair</span>
          </Link>
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-cream/40">Admin dashboard</p>
        </div>

        <form
          onSubmit={submit}
          noValidate
          className="mt-10 space-y-5 border border-cream/10 bg-onyx p-6 md:p-8"
        >
          <Field label="Email" error={errors.email}>
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              value={form.email}
              onChange={onChange}
              placeholder="you@akpluxuryhair.com"
            />
          </Field>
          <Field label="Password" error={errors.password}>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={onChange}
              placeholder="••••••••"
            />
          </Field>
          <PrimaryButton type="submit" loading={submitting} className="w-full">
            <Lock size={15} /> {submitting ? "Signing in" : "Sign in"}
          </PrimaryButton>
        </form>

        <p className="mt-6 text-center text-xs text-cream/30">
          Staff access only. Attempts are rate limited.
        </p>
      </div>
    </div>
  );
}
