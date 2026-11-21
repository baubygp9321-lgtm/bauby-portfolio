import { useId, useState } from "react";
import { FaArrowDown, FaArrowUp, FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import type { CardItem } from "../lib/portfolio";
import { btnDanger, btnGhost, hintCls, inputCls, labelCls, panelCls } from "./styles";
import { uploadAsset } from "./upload";

export type FieldKey = "title" | "desc" | "status" | "url" | "repo" | "image" | "tags";
export type FieldDef = { key: FieldKey; label: string; placeholder?: string; hint?: string };

type Props = {
  itemLabel: string;
  items: CardItem[];
  fields: FieldDef[];
  onChange: (items: CardItem[]) => void;
  setNotice: (msg: string) => void;
};

function ItemField({
  field,
  item,
  id,
  onPatch,
  setNotice,
}: {
  field: FieldDef;
  item: CardItem;
  id: string;
  onPatch: (patch: Partial<CardItem>) => void;
  setNotice: (msg: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fid = `${id}-${field.key}`;
  const value =
    field.key === "tags" ? (item.tags ?? []).join(", ") : ((item[field.key] as string | undefined) ?? "");

  const set = (v: string) => {
    if (field.key === "tags") {
      onPatch({ tags: v.split(",").map((t) => t.trimStart()) });
    } else {
      onPatch({ [field.key]: v } as Partial<CardItem>);
    }
  };

  return (
    <div className={field.key === "desc" ? "sm:col-span-2" : ""}>
      <label htmlFor={fid} className={labelCls}>
        {field.label}
      </label>
      {field.key === "desc" ? (
        <textarea id={fid} rows={3} className={inputCls} value={value} placeholder={field.placeholder} onChange={(e) => set(e.target.value)} />
      ) : (
        <div className="flex gap-2">
          <input
            id={fid}
            className={inputCls}
            value={value}
            placeholder={field.placeholder}
            inputMode={["url", "repo", "image"].includes(field.key) ? "url" : undefined}
            onChange={(e) => set(e.target.value)}
            onBlur={() => field.key === "tags" && onPatch({ tags: (item.tags ?? []).map((t) => t.trim()).filter(Boolean) })}
          />
          {field.key === "image" && (
            <label className={`${btnGhost} shrink-0 cursor-pointer ${uploading ? "pointer-events-none opacity-50" : ""}`} title="Upload image">
              <FaUpload aria-hidden />
              <span className="sr-only">Upload image for {item.title || "this item"}</span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  setUploading(true);
                  try {
                    onPatch({ image: await uploadAsset(file, "project") });
                    setNotice("Image uploaded. Click Save Changes to publish it.");
                  } catch (err) {
                    setNotice((err as Error).message);
                  } finally {
                    setUploading(false);
                  }
                }}
              />
            </label>
          )}
        </div>
      )}
      {field.hint && <p className={hintCls}>{field.hint}</p>}
    </div>
  );
}

/** Structured editor for a list of cards: add, edit, reorder and remove — no JSON required. */
export function ListEditor({ itemLabel, items, fields, onChange, setNotice }: Props) {
  const uid = useId();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const patch = (i: number, p: Partial<CardItem>) => onChange(items.map((it, j) => (j === i ? { ...it, ...p } : it)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {items.length === 0 && <p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-subtle">No {itemLabel.toLowerCase()} items — this section is hidden on the public site. Use “Add missing default items” to restore the built-in ones.</p>}
      {items.map((item, i) => (
        <fieldset key={i} className={panelCls}>
          <legend className="sr-only">
            {itemLabel} {i + 1}: {item.title || "untitled"}
          </legend>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="min-w-0 truncate text-sm font-semibold text-fg">
              <span className="text-subtle">#{i + 1}</span> {item.title || <em className="text-subtle">Untitled</em>}
            </p>
            <div className="flex gap-1.5">
              <button type="button" className={`${btnGhost} w-11 px-0`} onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${item.title || "item"} up`}>
                <FaArrowUp aria-hidden />
              </button>
              <button
                type="button"
                className={`${btnGhost} w-11 px-0`}
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                aria-label={`Move ${item.title || "item"} down`}
              >
                <FaArrowDown aria-hidden />
              </button>
              {confirmDelete === i ? (
                <>
                  <button
                    type="button"
                    className={btnDanger}
                    onClick={() => {
                      onChange(items.filter((_, j) => j !== i));
                      setConfirmDelete(null);
                    }}
                  >
                    Confirm delete
                  </button>
                  <button type="button" className={btnGhost} onClick={() => setConfirmDelete(null)}>
                    Keep
                  </button>
                </>
              ) : (
                <button type="button" className={`${btnDanger} w-11 px-0`} onClick={() => setConfirmDelete(i)} aria-label={`Delete ${item.title || "item"}`}>
                  <FaTrash aria-hidden />
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <ItemField key={f.key} field={f} item={item} id={`${uid}-${i}`} onPatch={(p) => patch(i, p)} setNotice={setNotice} />
            ))}
          </div>
        </fieldset>
      ))}
      <button type="button" className={`${btnGhost} justify-self-start`} onClick={() => onChange([...items, { title: "", desc: "" }])}>
        <FaPlus aria-hidden /> Add {itemLabel.toLowerCase()}
      </button>
    </div>
  );
}
