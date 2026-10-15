import { SiteShell } from "@/components/site-shell";
import { demoItems } from "@/lib/demo-data";
const value = (value: number | null, unit: string) =>
  value === null ? "Not available" : `${value} ${unit}`;
export default function ComparePage() {
  return (
    <SiteShell>
      <section className="shell section">
        <p className="state-label">Illustrative comparison</p>
        <h1 className="page-title">Compare meals per serving.</h1>
        <p className="lede">Demo values are illustrative and missing data remains unavailable.</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                {demoItems.slice(0, 3).map((item) => (
                  <th key={item.slug}>{item.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Calories", "calories", "kcal"],
                ["Protein", "proteinG", "g"],
                ["Carbohydrates", "carbsG", "g"],
                ["Fat", "fatG", "g"],
                ["Sodium", "sodiumMg", "mg"],
              ].map(([label, key, unit]) => (
                <tr key={key}>
                  <th>{label}</th>
                  {demoItems.slice(0, 3).map((item) => (
                    <td key={item.slug}>
                      {value(item[key as keyof typeof item] as number | null, unit)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </SiteShell>
  );
}
