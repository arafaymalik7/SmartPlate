export type DisclosureState = "PRESENT" | "ABSENT_VERIFIED" | "UNKNOWN";

const disclosureStates = new Set<DisclosureState>(["PRESENT", "ABSENT_VERIFIED", "UNKNOWN"]);

export const parseDisclosures = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, rawState] = line.split("|").map((entry) => entry.trim());
      return {
        name,
        state: disclosureStates.has(rawState as DisclosureState)
          ? (rawState as DisclosureState)
          : "UNKNOWN",
      };
    })
    .filter((entry): entry is { name: string; state: DisclosureState } => entry.name.length > 0);

export const formatDisclosures = (entries: ReadonlyArray<{ name: string; state: string }>) =>
  entries.map((entry) => `${entry.name} | ${entry.state}`).join("\n");
