export const getMediaUrl = (value?: string | null) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;

  return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${encodeURIComponent(value)}`;
};
