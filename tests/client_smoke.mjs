/* Offline-rendering smoke test: tests generated UI markup, NOT real browser behavior. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source = fs.readFileSync(new URL('../static/app.js', import.meta.url), 'utf8');
const node = { innerHTML:'', textContent:'',setAttribute(){},classList:{toggle(){},remove(){}} };
let pathname='/';
const item = {id:1,restaurant_id:1,restaurant_name:'Illustrative Restaurant',restaurant_slug:'illustrative',restaurant_accent:'sage',name:'Tofu Bowl',category:'Bowls',description:'Test meal',price:21,serving_size:'350 g',calories:550,protein:24,carbs:60,fat:16,sodium:580,fiber:9,vegetarian:true,featured:true,available:true,ingredients:['tofu'],allergens:['soy'],ingredients_verified:true,allergens_verified:false,nutrition_source_type:'illustrative',nutrition_source_url:''};
const restaurant={id:1,name:'Illustrative Restaurant',slug:'illustrative',cuisine:'Demo',description:'Test dining',location:'Campus',accent:'sage',item_count:1};
const calls={ '/api/restaurants':[restaurant], '/api/items':[item], '/api/meta':{categories:['Bowls'],total_items:1} };
const context = {
 document:{ querySelector(sel){return node},querySelectorAll(){return []},addEventListener(){} },
 window:{addEventListener(){},scrollTo(){}},
 location:{get pathname(){return pathname}},
 history:{pushState(){}},
 localStorage:{getItem(){return null},setItem(){}},
 fetch:async(url)=>({ok:true,json:async()=>calls[url]}),
 setTimeout,console,
};
vm.createContext(context);
vm.runInContext(source,context);
await new Promise(r=>setTimeout(r,50));
assert.match(node.innerHTML,/Good food/);
assert.match(node.innerHTML,/Illustrative Restaurant/);
pathname='/explore';vm.runInContext('render()',context);
assert.match(node.innerHTML,/Tofu Bowl/);
assert.match(node.innerHTML,/550 kcal/);
pathname='/recommend';vm.runInContext('render()',context);
assert.match(node.innerHTML,/Find matching plates/);
assert.match(node.innerHTML,/exclude_allergens/);
pathname='/about';vm.runInContext('render()',context);
assert.match(node.innerHTML,/rule-based/i);
console.log('PASS — Home, Explore, Recommend and About generated markup without JavaScript errors (mock DOM)');
