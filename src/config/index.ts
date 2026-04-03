export const WEBSITE_BASE_URL = "http://localhost:8080/";

export const resolveImageUrl = (path?: string) => {
  if (!path) {
    return "";
  }
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const base = WEBSITE_BASE_URL.endsWith("/")
    ? WEBSITE_BASE_URL
    : `${WEBSITE_BASE_URL}/`;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${cleanPath}`;
};
