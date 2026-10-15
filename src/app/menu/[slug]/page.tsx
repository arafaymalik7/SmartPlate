import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { getPublicCatalog } from "@/lib/public-catalog";

const value = (number: number | null, unit: string) =>
  number === null ? "Not available" : `${number} ${unit}`;

export default async function MenuItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const catalog = await getPublicCatalog();
  const item = catalog.items.find((value) => value.slug === slug);
  if (!item) notFound();
  return (
    <SiteShell>
      <section className="shell section">
        <p className="state-label">
          {catalog.source === "DATABASE" ? "Published nutrition data" : "Illustrative nutrition data"}
        </p>
        <h1 className="page-title">{item.name}</h1>
        <p className="lede">
          {item.description} MYR {item.price.toFixed(2)} · {item.restaurant} · {item.category}
        </p>
        <div className="feature-grid">
          <article>
            <h3>Per serving</h3>
            <p>{item.servingSize}</p>
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
            <h3>Ingredients and dietary status</h3>
            <p>{item.ingredients.join(", ")}</p>
            <p>
              {item.dietaryStatus === "UNKNOWN"
                ? "Dietary status is not verified."
                : item.dietaryStatus.replace("_", " ").toLowerCase()}
            </p>
          </article>
          <article>
            <h3>Allergen disclosure</h3>
            <p>
              {item.allergenDisclosure === "UNKNOWN"
                ? "Not available — do not treat this item as allergy-safe."
                : "Contains declared allergen information; cross-contact is not assessed."}
            </p>
          </article>
          <article>
            <h3>Source and review</h3>
            <p>{item.sourceCitation}</p>
            <p>
              {item.sourceType === "ILLUSTRATIVE"
                ? "This nutrition information is illustrative, not restaurant-verified."
                : "This published nutrition information has the source type shown in the menu record."}
            </p>
            <p>Last reviewed: {item.reviewedAt}</p>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
