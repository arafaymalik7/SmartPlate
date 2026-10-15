import pytest
from smartplate.recommender import rank_items
from smartplate.schemas import Preferences


def dish(**kwargs):
    data=dict(id=1,restaurant_id=1,available=True,price=20,vegetarian=True,
              calories=550,protein=30,carbs=60,fat=15,sodium=400,fiber=7,
              ingredients=['rice','tofu'],allergens=['soy'],
              ingredients_verified=True,allergens_verified=False,
              nutrition_source_type='illustrative',serving_size='350 g')
    return data|kwargs


def test_exact_calorie_target_ranks_above_far_target_when_other_equal():
    a,b=dish(id=1,calories=550),dish(id=2,calories=1150)
    results=rank_items([b,a],Preferences(target_calories=550))
    assert results['results'][0]['id']==1


def test_vegetarian_filter_rejects_unknown_and_nonvegetarian():
    data=[dish(id=1),dish(id=2,vegetarian=False),dish(id=3,vegetarian=None)]
    actual=rank_items(data,Preferences(vegetarian_only=True))
    assert actual['count']==1
    assert actual['excluded_summary']['Vegetarian status not confirmed']==2


def test_ingredient_exclusion_blocks_known_ingredient():
    result=rank_items([dish()],Preferences(exclude_ingredients=['tofu']))
    assert result['count']==0


def test_missing_ingredient_verification_fails_closed():
    result=rank_items([dish(ingredients_verified=False)],Preferences(exclude_ingredients=['peanut']))
    assert result['count']==0
    assert 'Ingredients not verified' in result['excluded_summary']


def test_missing_allergen_verification_never_labels_safe():
    result=rank_items([dish()],Preferences(exclude_allergens=['peanut']))
    assert result['count']==0
    assert result['excluded_summary']['Allergen declarations not verified']==1


def test_allergen_present_even_if_verified_is_excluded():
    result=rank_items([dish(allergens_verified=True)],Preferences(exclude_allergens=['soy']))
    assert result['count']==0


def test_allergen_caveat_when_verified_and_not_listed():
    result=rank_items([dish(allergens_verified=True)],Preferences(exclude_allergens=['milk']))
    assert any('cross-contact' in c for c in result['results'][0]['caveats'])


def test_missing_calories_and_other_nutrients_are_not_zero():
    assert rank_items([dish(calories=None)],Preferences())['count']==0
    result=rank_items([dish(protein=None,sodium=None)],Preferences(priority='lower_sodium'))
    assert result['results'][0]['score_parts']['priority_fit']==0
    assert 'Some nutrition values are unavailable' in result['results'][0]['caveats']


def test_budget_limit_and_unavailable_filter():
    result=rank_items([dish(id=1,price=30),dish(id=2,available=False),dish(id=3,price=15)],Preferences(max_price=20))
    assert [x['id'] for x in result['results']]==[3]


def test_selected_priority_changes_rankings():
    a=dish(id=1,protein=40,sodium=1150)
    b=dish(id=2,protein=10,sodium=100)
    assert rank_items([a,b],Preferences(priority='high_protein'))['results'][0]['id']==1
    assert rank_items([a,b],Preferences(priority='lower_sodium'))['results'][0]['id']==2


def test_repeatable_and_scores_bounded():
    items=[dish(id=12),dish(id=3),dish(id=9)]
    a=rank_items(items,Preferences());b=rank_items(items,Preferences())
    assert a==b
    assert all(0<=x['score']<=100 for x in a['results'])


def test_invalid_nutrition_preferences_are_rejected():
    with pytest.raises(ValueError):Preferences(target_calories=-1)
    with pytest.raises(ValueError):Preferences(priority='miracle')
