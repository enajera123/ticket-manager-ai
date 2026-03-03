export function getInitials(name: string): string {
    return name
        .split(" ")
        .filter(n => n.length > 0)
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();
}