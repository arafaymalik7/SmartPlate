"""Deterministic synthetic demo restaurants and 48 menu entries.

All nutrition figures and prices are ILLUSTRATIVE, never represented as official
restaurant, USDA, or Malaysian Food Composition Database records.
"""
import json
from .database import connect, init_db

RESTAURANTS = [
 ('Harvest & Hearth','Contemporary Malaysian','Fresh everyday meals inspired by local produce and balanced plates.','Kuala Lumpur','sage'),
 ('The Noodle Edit','Asian Fusion','Comforting bowls and vibrant stir-fries, imagined for a demo menu.','Petaling Jaya','peach'),
 ('Coastal Table','Coastal & Mediterranean','Grilled favorites, bright salads and coastal flavours.','Penang','mint'),
 ('Everyday Green','Plant-Forward','Colourful plant-based bowls, wraps and light café fare.','Subang Jaya','orange'),
]
# Name | Category | Description | Price RM | grams | kcal | protein | carbs | fat | sodium | fiber | vegetarian | ingredients
DATA = [
 [
 ('Herb Chicken Rice Bowl','Bowls','Grilled chicken, brown rice, crisp greens and herbed dressing',24,380,525,36,56,16,680,7,False,'chicken,rice,lettuce,cucumber,olive oil'),
 ('Roasted Vegetable Medley','Bowls','Roasted seasonal vegetables with chickpea hummus',21,340,420,16,49,17,420,12,True,'chickpeas,carrot,zucchini,olive oil,sesame'),
 ('Ginger Salmon Plate','Mains','Pan-seared salmon with rice and steamed vegetables',38,350,610,39,51,26,530,6,False,'salmon,rice,broccoli,ginger,soy'),
 ('Citrus Quinoa Salad','Salads','Quinoa tossed with citrus segments and baby leaves',23,300,380,12,49,14,290,9,True,'quinoa,orange,spinach,olive oil,almond'),
 ('Spiced Tofu Bowl','Bowls','Baked tofu over brown rice with cabbage slaw',22,390,495,24,61,17,570,9,True,'tofu,rice,cabbage,carrot,soy'),
 ('Chicken Pumpkin Soup','Soups','Smooth pumpkin broth with shredded chicken',17,300,270,22,23,10,460,5,False,'chicken,pumpkin,onion,milk'),
 ('Sweet Potato Chickpea Wrap','Wraps','Warm wrap packed with sweet potato and chickpeas',19,290,465,15,63,15,610,10,True,'wheat,chickpeas,sweet potato,spinach'),
 ('Grilled Beef Garden Plate','Mains','Lean beef with herb potatoes and garden vegetables',34,390,655,42,45,32,740,7,False,'beef,potato,broccoli,olive oil'),
 ('Mushroom Barley Pilaf','Bowls','Nutty barley and sautéed mushrooms with herbs',21,330,440,14,69,12,480,11,True,'barley,mushroom,onion,olive oil'),
 ('Avocado Egg Toast','Breakfast','Wholegrain toast topped with egg and avocado',20,260,410,18,34,23,490,9,True,'egg,wheat,avocado,tomato'),
 ('Berry Yogurt Cup','Breakfast','Greek-style yogurt layered with berries and oats',16,220,255,17,30,7,95,5,True,'milk,berries,oats,honey'),
 ('Lentil Tomato Stew','Soups','Red lentils cooked with tomatoes and aromatic spices',18,310,345,19,48,8,390,13,True,'lentils,tomato,onion,olive oil'),
 ],[
 ('Sesame Chicken Noodles','Noodles','Wheat noodles with chicken, greens and sesame dressing',23,400,590,33,72,18,970,6,False,'wheat,chicken,soy,sesame,bok choy'),
 ('Miso Tofu Udon','Noodles','Udon with tofu, mushrooms and miso broth',21,430,480,20,68,13,1180,6,True,'wheat,tofu,soy,mushroom,miso'),
 ('Beef Pepper Rice','Rice','Pepper beef strips on steamed rice',27,380,650,32,76,24,1020,4,False,'beef,rice,pepper,soy,onion'),
 ('Vegetable Soba Salad','Salads','Chilled buckwheat noodles with crunchy vegetables',22,330,405,15,57,13,680,8,True,'buckwheat,carrot,cabbage,soy,sesame'),
 ('Spicy Prawn Rice Bowl','Rice','Prawns with jasmine rice and chili-lime sauce',30,380,560,31,72,14,850,4,False,'prawns,rice,chilli,lime,garlic'),
 ('Chicken Pho-Style Soup','Soups','Rice noodle broth with chicken, herbs and bean sprouts',25,440,430,29,52,9,1080,4,False,'chicken,rice noodles,onion,bean sprouts'),
 ('Ginger Veggie Stir Fry','Mains','Broccoli, mushrooms and tofu in a ginger glaze',21,300,345,21,32,15,730,8,True,'tofu,broccoli,mushroom,soy,ginger'),
 ('Teriyaki Salmon Bento','Rice','Salmon with rice and lightly sautéed greens',35,420,690,37,75,26,990,5,False,'salmon,rice,soy,sesame,spinach'),
 ('Peanut Tofu Rice Noodles','Noodles','Soft rice noodles tossed with tofu and peanut sauce',22,380,605,23,68,26,780,7,True,'tofu,rice noodles,peanut,cucumber'),
 ('Mushroom Dumpling Bowl','Mains','Steamed vegetable dumplings with light broth',19,340,370,12,56,11,810,5,True,'wheat,mushroom,cabbage,soy'),
 ('Coconut Chicken Laksa','Noodles','Creamy coconut broth with rice noodles and chicken',28,460,760,34,67,40,1350,4,False,'chicken,coconut milk,rice noodles,chilli'),
 ('Edamame Crunch Salad','Salads','Edamame, red cabbage, citrus and sesame',20,300,330,18,30,17,340,11,True,'soy,cabbage,orange,sesame'),
 ],[
 ('Lemon Grilled Fish','Mains','White fish with warm potatoes and steamed spinach',35,390,495,38,43,16,470,6,False,'fish,potato,spinach,lemon'),
 ('Mediterranean Chickpea Bowl','Bowls','Chickpeas, cucumber, tomato and couscous',24,380,510,19,72,17,600,13,True,'chickpeas,wheat,cucumber,tomato,olive oil'),
 ('Garlic Shrimp Pasta','Pasta','Shrimp with wholewheat pasta and garlic oil',32,410,630,35,74,21,790,9,False,'prawns,wheat,garlic,olive oil'),
 ('Herb Lamb Skewers','Mains','Grilled lamb with flatbread and fresh salad',37,390,710,40,49,39,840,5,False,'lamb,wheat,tomato,onion'),
 ('Tomato Basil Soup','Soups','Slow-cooked tomatoes with basil and olive oil',16,320,240,7,27,12,530,6,True,'tomato,onion,olive oil,basil'),
 ('Falafel Garden Wrap','Wraps','Baked chickpea falafel with salad and tahini',23,330,540,20,60,24,750,11,True,'chickpeas,wheat,sesame,lettuce'),
 ('Seared Tuna Grain Bowl','Bowls','Tuna, freekeh and roasted vegetables',36,400,565,43,48,21,580,8,False,'tuna,wheat,carrot,zucchini'),
 ('Greek-Style Salad','Salads','Cucumber, tomato, olives and feta-style cheese',23,330,365,13,21,27,720,5,True,'milk,cucumber,tomato,olive'),
 ('Chicken Olive Couscous','Bowls','Chicken breast over herbed couscous and olives',28,370,570,39,62,18,720,7,False,'chicken,wheat,olive,parsley'),
 ('Roasted Eggplant Plate','Mains','Smoky eggplant, lentils and yogurt sauce',24,370,450,18,50,20,490,12,True,'eggplant,lentils,milk,olive oil'),
 ('Citrus Fruit Bowl','Desserts','Fresh seasonal fruit with lime and mint',15,240,185,3,43,1,12,6,True,'orange,watermelon,pineapple,lime'),
 ('Seafood Herb Rice','Rice','Mixed seafood over fragrant lemon rice',36,420,645,38,75,20,890,4,False,'fish,prawns,rice,lemon'),
 ],[
 ('Rainbow Nourish Bowl','Bowls','Quinoa, roasted carrots, chickpeas and tahini',25,400,520,19,68,20,450,13,True,'quinoa,chickpeas,carrot,sesame'),
 ('Tempeh Protein Plate','Mains','Seared tempeh with brown rice and greens',27,390,585,32,60,23,620,10,True,'soy,rice,broccoli,olive oil'),
 ('Spinach Mushroom Wrap','Wraps','Wholegrain wrap with sautéed mushrooms and spinach',20,320,450,17,54,17,540,9,True,'wheat,mushroom,spinach,onion'),
 ('Green Pea Soup','Soups','Creamy green peas with herbs and oat cream',17,330,295,14,41,9,470,11,True,'peas,onion,oats,mint'),
 ('Tofu Poke-Style Bowl','Bowls','Tofu, cucumber, edamame and seasoned rice',26,410,555,27,66,20,790,9,True,'tofu,soy,rice,cucumber,sesame'),
 ('Peanut Banana Overnight Oats','Breakfast','Oats with banana, chia and peanut butter',18,310,440,16,57,18,160,11,True,'oats,banana,peanut,chia'),
 ('Lentil Spinach Curry','Mains','Red lentil curry with spinach and rice',23,410,615,23,90,16,780,17,True,'lentils,spinach,rice,coconut milk'),
 ('Chickpea Avocado Sandwich','Wraps','Wholegrain bread filled with mashed chickpea and avocado',21,290,480,15,53,24,560,12,True,'wheat,chickpeas,avocado,lemon'),
 ('Roasted Beetroot Salad','Salads','Beetroot, orange and toasted pumpkin seeds',22,300,350,11,38,16,290,9,True,'beetroot,orange,pumpkin seeds,spinach'),
 ('Mango Coconut Chia Pot','Desserts','Chia pudding with fresh mango and coconut',17,220,310,7,34,17,80,10,True,'chia,mango,coconut milk'),
 ('Baked Tofu Satay Bowl','Bowls','Baked tofu, rice and peanut satay sauce',26,430,670,29,73,29,880,8,True,'tofu,soy,rice,peanut,cucumber'),
 ('Kale White Bean Soup','Soups','Hearty white beans, kale and tomato broth',19,340,325,17,47,8,520,12,True,'white beans,kale,tomato,onion'),
 ]
]
ALLERGEN_HINTS = {'milk':'milk','cheese':'milk','wheat':'wheat','barley':'wheat','soy':'soy','tofu':'soy','tempeh':'soy','peanut':'peanut','almond':'tree nuts','sesame':'sesame','prawns':'shellfish','fish':'fish','salmon':'fish','tuna':'fish','egg':'egg'}


def slugify(name):
    import re
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


def seed_if_empty():
    init_db()
    with connect() as db:
        if db.execute('SELECT count(*) FROM restaurants').fetchone()[0]:
            return False
        for r, items in zip(RESTAURANTS, DATA):
            cur=db.execute('INSERT INTO restaurants(name,slug,cuisine,description,location,accent) VALUES(?,?,?,?,?,?)',
                           (r[0],slugify(r[0]),r[1],r[2],r[3],r[4]))
            rest_id=cur.lastrowid
            for idx, v in enumerate(items):
                name,cat,desc,price,grams,kcal,prot,carbs,fat,sod,fiber,veg,ingredients=v
                ing=ingredients.split(',')
                allergens=sorted({allergen for key,allergen in ALLERGEN_HINTS.items() if any(key in x for x in ing)})
                db.execute('''INSERT INTO menu_items(restaurant_id,name,category,description,price,serving_size,
                    calories,protein,carbs,fat,sodium,fiber,vegetarian,ingredients_json,allergens_json,
                    ingredients_verified,allergens_verified,nutrition_source_type,available,featured)
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)''',
                    (rest_id,name,cat,desc,price,f'{grams} g',kcal,prot,carbs,fat,sod,fiber,
                     int(veg),json.dumps(ing),json.dumps(allergens),
                     1,0,'illustrative',1,int(idx in [0,1,2])))
    return True
