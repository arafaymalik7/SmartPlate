"""Deterministic, safety-conservative, explainable rule-based recommender.

All weights are design choices, NOT medical recommendations or validated clinical
thresholds. Missing nutrients are unknown, never zero. Restrictions with
unverified ingredient or allergen data are conservatively excluded.
"""
from collections import Counter
from .schemas import Preferences

WEIGHTS = {'calorie_fit': 40, 'priority_fit': 30, 'completeness': 20, 'fiber_bonus': 10}
NUTRIENTS = ('calories','protein','carbs','fat','sodium','fiber')


def clamp(x):
    return max(0.0, min(1.0, x))


def rank_items(items: list[dict], pref: Preferences, limit: int = 12) -> dict:
    ranked = []
    excluded = Counter()
    for item in items:
        if not item['available']:
            excluded['Unavailable'] += 1
            continue
        if pref.restaurant_id and item['restaurant_id'] != pref.restaurant_id:
            excluded['Outside selected restaurant'] += 1
            continue
        if pref.max_price is not None and item['price'] > pref.max_price:
            excluded['Above price limit'] += 1
            continue
        if pref.vegetarian_only and item['vegetarian'] is not True:
            excluded['Vegetarian status not confirmed'] += 1
            continue
        ingredients = [x.lower().strip() for x in item.get('ingredients',[])]
        allergens = [x.lower().strip() for x in item.get('allergens',[])]
        if pref.exclude_ingredients:
            if not item['ingredients_verified']:
                excluded['Ingredients not verified'] += 1
                continue
            if any(x in ingredients or any(x in name for name in ingredients) for x in pref.exclude_ingredients):
                excluded['Excluded ingredient listed'] += 1
                continue
        if pref.exclude_allergens:
            # Even when declared allergens are verified, cross-contact is NOT guaranteed absent.
            if not item['allergens_verified']:
                excluded['Allergen declarations not verified'] += 1
                continue
            if any(x in allergens for x in pref.exclude_allergens):
                excluded['Excluded allergen listed'] += 1
                continue
        if item['calories'] is None:
            excluded['Calories missing'] += 1
            continue

        calorie_ratio = clamp(1 - abs(item['calories'] - pref.target_calories) / max(pref.target_calories,300))
        n_known = sum(item.get(k) is not None for k in NUTRIENTS)
        completeness = n_known / len(NUTRIENTS)
        priority = pref.priority
        metric = None
        if priority == 'high_protein':
            metric = item['protein']
            priority_ratio = clamp(metric / 40) if metric is not None else 0
        elif priority == 'lower_sodium':
            metric = item['sodium']
            priority_ratio = clamp(1 - metric / 1300) if metric is not None else 0
        elif priority == 'lower_carbs':
            metric = item['carbs']
            priority_ratio = clamp(1 - metric / 100) if metric is not None else 0
        else:
            protein = item['protein']
            fat = item['fat']
            carbs = item['carbs']
            # Completeness-aware, descriptive heuristic, not a dietary standard.
            priority_ratio = (clamp(protein / 35)*0.5 + clamp(1-abs(fat-18)/35)*0.25 + clamp(1-abs(carbs-55)/100)*0.25) if None not in (protein,fat,carbs) else 0
        fiber_ratio = clamp(item['fiber']/10) if item['fiber'] is not None else 0
        parts = {
            'calorie_fit': round(calorie_ratio*WEIGHTS['calorie_fit'], 1),
            'priority_fit': round(priority_ratio*WEIGHTS['priority_fit'], 1),
            'completeness': round(completeness*WEIGHTS['completeness'],1),
            'fiber_bonus': round(fiber_ratio*WEIGHTS['fiber_bonus'],1),
        }
        score = round(sum(parts.values()), 1)
        reasons = [f"{item['calories']:g} kcal per {item['serving_size']}; target {pref.target_calories} kcal"]
        if priority == 'high_protein' and item['protein'] is not None:
            reasons.append(f"{item['protein']:g} g protein per serving")
        elif priority == 'lower_sodium' and item['sodium'] is not None:
            reasons.append(f"{item['sodium']:g} mg sodium per serving")
        elif priority == 'lower_carbs' and item['carbs'] is not None:
            reasons.append(f"{item['carbs']:g} g carbohydrates per serving")
        elif priority == 'balanced' and item['protein'] is not None:
            reasons.append(f"{item['protein']:g} g protein per serving")
        if n_known == len(NUTRIENTS):
            reasons.append('All six displayed nutrients are present in the dataset')
        caveats = []
        if n_known < len(NUTRIENTS):
            caveats.append('Some nutrition values are unavailable')
        if item['nutrition_source_type'] in ('illustrative','estimated'):
            caveats.append('Nutrition figures are illustrative or estimated, not restaurant-verified')
        if pref.exclude_allergens:
            caveats.append('Allergen declarations cannot rule out cross-contact; contact the restaurant')
        elif not item['allergens_verified']:
            caveats.append('Allergen information is not independently verified')
        ranked.append({**item, 'score': score, 'score_parts': parts, 'reasons': reasons, 'caveats': caveats})
    ranked.sort(key=lambda i: (-i['score'], abs(i['calories'] - pref.target_calories), i['id']))
    return {
        'preferences': pref.model_dump(),
        'count': len(ranked),
        'results': ranked[:limit],
        'excluded_summary': dict(excluded),
        'method': 'Transparent rule-based ranking. Weights: calorie fit 40, selected priority 30, data completeness 20, fiber 10. These are application heuristics, not clinical guidelines.',
        'notice': 'Informational planning only. Nutrition values may be illustrative. Meals are not certified allergen-safe or medically suitable.'
    }
