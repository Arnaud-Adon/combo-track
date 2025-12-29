export function getInitials(name?: string | null, email?: string): string {
  if (!name || name.trim() === "") {
    return email ? email[0].toUpperCase() : "?";
  }

  return name
    .split(" ")
    .filter((n) => n.length > 0)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
