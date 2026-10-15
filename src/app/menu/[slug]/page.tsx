import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { demoItems } from "@/lib/demo-data";
const value = (n: number | null, unit: string) => (n === null ? "Not available" : `${n} ${unit}`);
export default async function MenuItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = demoItems.find((v) => v.slug === slug);
  if (!item) notFound();
  return (
    <SiteShell>
      <section className="shell section">
        <p className="state-label">{item.sourceType.toLowerCase()} data</p>
        <h1 className="page-title">{item.name}</h1>
        <p className="lede">
          MYR {item.price.toFixed(2)} · {item.restaurant} · {item.category}
        </p>
        <div className="feature-grid">
          <article>
            <h3>Per serving</h3>
            <p>
              {value(item.calories, "kcal")}
              <br />
              {value(item.proteinG, "g protein")}
              <br />
              {value(item.carbsG, "g carbohydrates")}
              <br />
              {value(item.fatG, "g fat")}
              <br />
              {value(item.sodiumMg, "mg sodium")}
            </p>
          </article>
          <article>
            <h3>Ingredients</h3>
            <p>{item.ingredients.join(", ")}</p>
          </article>
          <article>
            <h3>Allergen disclosure</h3>
            <p>
              {item.allergenDisclosure === "UNKNOWN"
                ? "Not available — do not treat this item as allergy-safe."
                : "Contains declared allergen information; cross-contact is not assessed."}
            </p>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
