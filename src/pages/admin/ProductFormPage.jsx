import { useCallback, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Save, X } from "lucide-react";
import { createProduct, fetchAdminProduct, updateProduct } from "../../lib/adminApi";
import { useAsyncData } from "../../hooks/useAsyncData";
import { formatPrice } from "../../lib/format";
import {
  ErrorState,
  Field,
  GhostButton,
  Panel,
  PrimaryButton,
  Spinner,
} from "../../components/admin/ui";
import ImageUploader from "../../components/admin/ImageUploader";

const BLANK = {
  name: "",
  slug: "",
  category: "Wigs",
  price: "",
  badge: "",
  short: "",
  description: "",
  lengths: ['18"'],
  tone: ["#2a1c10", "#54381c"],
  details: [""],
  image: "",
  is_active: true,
};

const toFormState = (product) => ({
  name: product.name,
  slug: product.slug,
  category: product.category,
  price: String(product.price),
  badge: product.badge ?? "",
  short: product.short,
  description: product.description,
  lengths: product.lengths.length ? product.lengths : [""],
  tone: product.tone,
  details: product.details.length ? product.details : [""],
  image: product.image ?? "",
  is_active: product.is_active,
});

/**
 * Fetches first and only then mounts the form, so the editor's state is seeded
 * from real values instead of being synced into place by an effect.
 */
export default function ProductFormPage() {
  const { slug } = useParams();
  const isEdit = Boolean(slug);

  const fetcher = useCallback(
    (signal) => (isEdit ? fetchAdminProduct(slug, signal) : Promise.resolve(null)),
    [slug, isEdit]
  );
  const { data, status, error, reload } = useAsyncData(fetcher);

  if (isEdit && status === "loading") return <Spinner label="Loading product" />;
  if (isEdit && status === "error") return <ErrorState message={error} onRetry={reload} />;

  return (
    <ProductForm
      slug={slug}
      isEdit={isEdit}
      initial={isEdit && data?.data ? toFormState(data.data) : BLANK}
    />
  );
}

function ProductForm({ slug, isEdit, initial }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
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

  const setListItem = (key, index, value) =>
    set({ [key]: form[key].map((item, i) => (i === index ? value : item)) });

  const addListItem = (key) => set({ [key]: [...form[key], ""] });

  const removeListItem = (key, index) =>
    set({ [key]: form[key].filter((_, i) => i !== index) });

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setErrors({});

    const payload = {
      name: form.name,
      slug: form.slug || null,
      category: form.category,
      price: Number(form.price),
      badge: form.badge || null,
      short: form.short,
      description: form.description,
      // Blank rows are scaffolding for the form, not data.
      lengths: form.lengths.map((l) => l.trim()).filter(Boolean),
      tone: form.tone,
      details: form.details.map((d) => d.trim()).filter(Boolean),
      image: form.image || null,
      is_active: form.is_active,
    };

    try {
      if (isEdit) {
        await updateProduct(slug, payload);
        toast.success("Product updated.");
      } else {
        await createProduct(payload);
        toast.success("Product created.");
      }
      navigate("/admin/products");
    } catch (err) {
      setErrors(err.errors ?? {});
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Nested array errors arrive as "lengths.0" — surface them on the group.
  const listError = (key) =>
    errors[key] ?? Object.entries(errors).find(([k]) => k.startsWith(`${key}.`))?.[1];

  return (
    <div className="space-y-6">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cream/50 transition-colors hover:text-gold"
      >
        <ArrowLeft size={14} /> Back to products
      </Link>

      <div>
        <h1 className="font-display text-3xl md:text-4xl">
          {isEdit ? "Edit product" : "New product"}
        </h1>
        <div className="hairline mt-4" />
      </div>

      <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Panel title="Details" bodyClass="p-5 md:p-6">
            <div className="space-y-5">
              <Field label="Name" error={errors.name}>
                <input
                  value={form.name}
                  onChange={(e) => set({ name: e.target.value })}
                  placeholder="Aurora Body Wave Wig"
                  required
                />
              </Field>
              <Field
                label="Slug"
                error={errors.slug}
                hint={isEdit ? "Changing this changes the storefront URL." : "Leave blank to generate from the name."}
              >
                <input
                  value={form.slug}
                  onChange={(e) => set({ slug: e.target.value })}
                  placeholder="aurora-body-wave-wig"
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Category" error={errors.category}>
                  <input
                    value={form.category}
                    onChange={(e) => set({ category: e.target.value })}
                    placeholder="Wigs"
                    required
                  />
                </Field>
                <Field
                  label="Price (₦)"
                  error={errors.price}
                  hint={form.price ? formatPrice(Number(form.price) || 0) : undefined}
                >
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => set({ price: e.target.value })}
                    placeholder="385000"
                    required
                  />
                </Field>
              </div>
              <Field label="Badge" error={errors.badge} hint="Optional — e.g. Bestseller, New.">
                <input
                  value={form.badge}
                  onChange={(e) => set({ badge: e.target.value })}
                  placeholder="Bestseller"
                />
              </Field>
              <Field label="Short description" error={errors.short}>
                <input
                  value={form.short}
                  onChange={(e) => set({ short: e.target.value })}
                  placeholder="Full-density 13x4 HD lace body wave."
                  required
                />
              </Field>
              <Field label="Full description" error={errors.description}>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) => set({ description: e.target.value })}
                  required
                />
              </Field>
              <Field
                label="Product image"
                error={errors.image}
                hint="Optional. Stored in Cloudinary. Without one, the storefront draws the tone gradient below."
              >
                <ImageUploader
                  value={form.image}
                  onChange={(image) => set({ image })}
                  disabled={saving}
                />
              </Field>
            </div>
          </Panel>

          <Panel title="Lengths" bodyClass="p-5 md:p-6">
            <ListEditor
              items={form.lengths}
              placeholder='20"'
              error={listError("lengths")}
              onChange={(i, v) => setListItem("lengths", i, v)}
              onAdd={() => addListItem("lengths")}
              onRemove={(i) => removeListItem("lengths", i)}
              addLabel="Add length"
            />
          </Panel>

          <Panel title="Detail bullets" bodyClass="p-5 md:p-6">
            <ListEditor
              items={form.details}
              placeholder="13x4 HD transparent lace"
              error={listError("details")}
              onChange={(i, v) => setListItem("details", i, v)}
              onAdd={() => addListItem("details")}
              onRemove={(i) => removeListItem("details", i)}
              addLabel="Add detail"
            />
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel title="Visibility" bodyClass="p-5">
            <label className="flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => set({ is_active: e.target.checked })}
                className="h-4 w-4 accent-[#c9a34a]"
              />
              Live on the storefront
            </label>
            <p className="mt-3 text-xs text-cream/30">
              Hidden products stay in past orders but disappear from the shop.
            </p>
          </Panel>

          <Panel title="Tone gradient" bodyClass="p-5">
            <div
              className="mb-4 h-28 w-full border border-cream/10"
              style={{ background: `linear-gradient(150deg, ${form.tone[0]}, ${form.tone[1]})` }}
            />
            <div className="grid grid-cols-2 gap-3">
              {[0, 1].map((i) => (
                <div key={i}>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-cream/40">
                    {i === 0 ? "Start" : "End"}
                  </label>
                  <input
                    type="color"
                    value={form.tone[i]}
                    onChange={(e) =>
                      set({ tone: form.tone.map((t, ti) => (ti === i ? e.target.value : t)) })
                    }
                    className="h-10 cursor-pointer p-1"
                  />
                </div>
              ))}
            </div>
            {listError("tone") && <p className="mt-2 text-xs text-red-400">{listError("tone")}</p>}
          </Panel>

          <div className="flex gap-3">
            <PrimaryButton type="submit" loading={saving} className="flex-1">
              <Save size={15} /> {saving ? "Saving" : "Save product"}
            </PrimaryButton>
            <GhostButton type="button" onClick={() => navigate("/admin/products")}>
              Cancel
            </GhostButton>
          </div>
        </aside>
      </form>
    </div>
  );
}

function ListEditor({ items, placeholder, error, onChange, onAdd, onRemove, addLabel }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            value={item}
            placeholder={placeholder}
            onChange={(e) => onChange(index, e.target.value)}
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            disabled={items.length === 1}
            className="shrink-0 border border-cream/15 px-3 text-cream/40 transition-colors hover:border-red-400/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-25"
            aria-label="Remove"
          >
            <X size={15} />
          </button>
        </div>
      ))}
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold transition-opacity hover:opacity-70"
      >
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );
}
