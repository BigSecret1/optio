export default function initials(name = "") {
  const parts = name.split(" ").filter(Boolean);
  const letters = (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  return letters.toUpperCase();
}
