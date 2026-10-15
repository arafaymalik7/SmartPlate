"""Strict request schemas. Never accept client-generated SQL or unbounded strings."""
from typing import Literal
from pydantic import BaseModel, Field, field_validator, model_validator


class RestaurantInput(BaseModel):
    name: str = Field(min_length=2, max_length=90)
    cuisine: str = Field(min_length=2, max_length=60)
    description: str = Field(default='', max_length=500)
    location: str = Field(default='', max_length=100)
    accent: Literal['sage','orange','peach','mint','lavender'] = 'sage'
    published: bool = True


class MenuItemInput(BaseModel):
    restaurant_id: int = Field(gt=0)
    name: str = Field(min_length=2, max_length=110)
    category: str = Field(min_length=2, max_length=45)
    description: str = Field(default='', max_length=600)
    price: float = Field(ge=0, le=100000)
    serving_size: str = Field(min_length=2, max_length=60)
    calories: float | None = Field(default=None, ge=0, le=10000)
    protein: float | None = Field(default=None, ge=0, le=1000)
    carbs: float | None = Field(default=None, ge=0, le=1000)
    fat: float | None = Field(default=None, ge=0, le=1000)
    sodium: float | None = Field(default=None, ge=0, le=100000)
    fiber: float | None = Field(default=None, ge=0, le=1000)
    vegetarian: bool | None = None
    ingredients: list[str] = Field(default_factory=list, max_length=40)
    allergens: list[str] = Field(default_factory=list, max_length=30)
    ingredients_verified: bool = False
    allergens_verified: bool = False
    nutrition_source_type: Literal['illustrative','estimated','restaurant_verified','food_composition'] = 'illustrative'
    nutrition_source_url: str = Field(default='', max_length=400)
    available: bool = True
    featured: bool = False

    @field_validator('ingredients','allergens')
    @classmethod
    def safe_lists(cls, values):
        clean = []
        for v in values:
            v = v.strip().lower()
            if not v or len(v)>55:
                raise ValueError('Ingredient/allergen labels must be 1-55 characters')
            if v not in clean:
                clean.append(v)
        return clean

    @field_validator('nutrition_source_url')
    @classmethod
    def source_url(cls, v):
        if v and not (v.startswith('https://') or v.startswith('http://')):
            raise ValueError('Source must be an http(s) URL')
        return v


class Preferences(BaseModel):
    target_calories: int = Field(default=550, ge=150, le=1500)
    vegetarian_only: bool = False
    exclude_ingredients: list[str] = Field(default_factory=list, max_length=20)
    exclude_allergens: list[str] = Field(default_factory=list, max_length=20)
    priority: Literal['balanced','high_protein','lower_sodium','lower_carbs'] = 'balanced'
    max_price: float | None = Field(default=None, ge=0, le=10000)
    restaurant_id: int | None = Field(default=None, gt=0)

    @field_validator('exclude_ingredients','exclude_allergens')
    @classmethod
    def clean_exclusions(cls, values):
        return [v.strip().lower() for v in values if v.strip() and len(v.strip()) <= 55]


class Credentials(BaseModel):
    username: str = Field(min_length=3, max_length=40)
    password: str = Field(min_length=1, max_length=500)
