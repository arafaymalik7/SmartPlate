# Recommendation algorithm

SMARTPLATE uses a deterministic, rule-based, informational ranking system. It is not a clinical model or trained AI.

Hard exclusions remove inactive dishes, diet-incompatible dishes, and known excluded ingredients/allergens. When a strict allergen exclusion is selected, dishes without explicitly verified absence are shown only in `Unable to verify`, never as safe matches.

Soft score weights are software parameters: calorie fit 40%, chosen priority 30%, nutrition completeness 20%, and verified diet fit 10%. Missing nutrients receive no invented zero-value score and create a limitation. Ties sort by name and slug.
