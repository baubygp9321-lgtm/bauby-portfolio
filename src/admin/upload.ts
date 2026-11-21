import { ASSET_BUCKET, supabase } from "../lib/supabase";

export type UploadKind = "avatar" | "cv" | "project";

const RULES: Record<UploadKind, { accept: RegExp; maxMb: number; label: string }> = {
  avatar: { accept: /^image\//, maxMb: 5, label: "an image" },
  project: { accept: /^image\//, maxMb: 5, label: "an image" },
  cv: { accept: /^application\/pdf$/, maxMb: 10, label: "a PDF" },
};

/**
 * Uploads to the existing `portfolio-assets` bucket using the original path scheme
 * (`<kind>/<timestamp>-<safe-name>`) and returns the public URL.
 */
export async function uploadAsset(file: File, kind: UploadKind): Promise<string> {
  if (!supabase) throw new Error("Supabase is not configured.");
  const rule = RULES[kind];
  if (!rule.accept.test(file.type)) throw new Error(`Please choose ${rule.label}.`);
  if (file.size > rule.maxMb * 1024 * 1024) throw new Error(`File is larger than ${rule.maxMb} MB.`);

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${kind}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from(ASSET_BUCKET).upload(path, file, { upsert: true });
  if (error) throw new Error("Upload failed. Check the portfolio-assets bucket and storage policies.");
  return supabase.storage.from(ASSET_BUCKET).getPublicUrl(path).data.publicUrl;
}
