import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { categories, products, tables } from "@db/schema";

export const seedRouter = createRouter({
  run: publicQuery.mutation(async () => {
    const db = getDb();

    // Clear existing data first
    await db.execute(`DELETE FROM order_items`);
    await db.execute(`DELETE FROM orders`);
    await db.execute(`DELETE FROM products`);
    await db.execute(`DELETE FROM categories`);
    await db.execute(`DELETE FROM tables`);

    // Seed categories
    const cats = await db
      .insert(categories)
      .values([
        { name: "Салати / Salads", sortOrder: 1, isActive: true },
        { name: "Разядки / Appetizer", sortOrder: 2, isActive: true },
        { name: "Хляб / Bread", sortOrder: 3, isActive: true },
        { name: "Предястия / Starters", sortOrder: 4, isActive: true },
        { name: "Говеждо / Beef", sortOrder: 5, isActive: true },
        { name: "Агнешко / Lamb", sortOrder: 6, isActive: true },
        { name: "Птица / Poultry", sortOrder: 7, isActive: true },
        { name: "Риба / Fish", sortOrder: 8, isActive: true },
        { name: "Десерти / Desserts", sortOrder: 9, isActive: true },
        { name: "Уиски / Whiskey", sortOrder: 10, isActive: true },
        { name: "Джин & Ром / Gin & Rum", sortOrder: 11, isActive: true },
        { name: "Водка / Vodka", sortOrder: 12, isActive: true },
        { name: "Анасонови / Anise Drinks", sortOrder: 13, isActive: true },
        { name: "Ракия / Rakia", sortOrder: 14, isActive: true },
        { name: "Ликьори / Liquors", sortOrder: 15, isActive: true },
        { name: "Текила / Tequila", sortOrder: 16, isActive: true },
        { name: "Бира / Beer", sortOrder: 17, isActive: true },
        { name: "Безалкохолни / Soft Drinks", sortOrder: 18, isActive: true },
        { name: "Фреш / Fresh Juices", sortOrder: 19, isActive: true },
        { name: "Топли напитки / Hot Drinks", sortOrder: 20, isActive: true },
      ])
      .$returningId();

    const catSalads = cats[0].id;
    const catAppetizer = cats[1].id;
    const catBread = cats[2].id;
    const catStarters = cats[3].id;
    const catBeef = cats[4].id;
    const catLamb = cats[5].id;
    const catPoultry = cats[6].id;
    const catFish = cats[7].id;
    const catDesserts = cats[8].id;
    const catWhiskey = cats[9].id;
    const catGinRum = cats[10].id;
    const catVodka = cats[11].id;
    const catAnise = cats[12].id;
    const catRakia = cats[13].id;
    const catLiquors = cats[14].id;
    const catTequila = cats[15].id;
    const catBeer = cats[16].id;
    const catSoftDrinks = cats[17].id;
    const catFresh = cats[18].id;
    const catHotDrinks = cats[19].id;

    // === SALADS (IMG_0108 + IMG_0109) ===
    await db.insert(products).values([
      { categoryId: catSalads, name: "La Opera", nameEn: "La Opera", weight: "330г", description: "Микс от зелени салати, айсберг, рукола, цвекло, авокадо, чери домати, орехи, сушени сливи, крутони, дресинг", priceBgn: "29.99", priceEur: "15.33", isAvailable: true, sortOrder: 1 },
      { categoryId: catSalads, name: "Turkish Cheese", nameEn: "Turkish Cheese", weight: "300г", description: "Микс зелени салати, чери домати, краставици, турско сирене, препечени филийки", priceBgn: "24.99", priceEur: "12.78", isAvailable: true, sortOrder: 2 },
      { categoryId: catSalads, name: "Avocado Shrimps", nameEn: "Avocado Shrimps", weight: "280г", description: "Микс зелени салати, авокадо, скариди, чери домати, дресинг", priceBgn: "29.99", priceEur: "15.33", isAvailable: true, sortOrder: 3 },
      { categoryId: catSalads, name: "Smoked Salmon", nameEn: "Smoked Salmon", weight: "220г", description: "Микс зелени салати, пушена сьомга, авокадо, дресинг", priceBgn: "29.99", priceEur: "15.33", isAvailable: true, sortOrder: 4 },
      { categoryId: catSalads, name: "Bresaola", nameEn: "Bresaola", weight: "220г", description: "Микс зелени салати, брезаола, пармезан, дресинг", priceBgn: "29.99", priceEur: "15.33", isAvailable: true, sortOrder: 5 },
      { categoryId: catSalads, name: "Choban", nameEn: "Choban", weight: "300г", description: "Микс зелени салати, домати, краставици, лук, сирене, маслини", priceBgn: "17.99", priceEur: "9.20", isAvailable: true, sortOrder: 6 },
      { categoryId: catSalads, name: "Burrata", nameEn: "Burrata", weight: "250г", description: "Бурата, чери домати, рукола, босилек, дресинг", priceBgn: "29.99", priceEur: "15.33", isAvailable: true, sortOrder: 7 },
      { categoryId: catSalads, name: "Greek", nameEn: "Greek Salad", weight: "350г", description: "Домати, краставици, лук, зелена чушка, маслини, сирене фета", priceBgn: "18.99", priceEur: "9.71", isAvailable: true, sortOrder: 8 },
      { categoryId: catSalads, name: "Tabbouleh", nameEn: "Tabbouleh", weight: "250г", description: "Магданоз, кус-кус, домати, лук, лимон, зехтин", priceBgn: "14.99", priceEur: "7.66", isAvailable: true, sortOrder: 9 },
      { categoryId: catSalads, name: "Caesar with Chicken", nameEn: "Caesar with Chicken", weight: "250г", description: "Айсберг, пилешко филе, пармезан, крутони, дресинг Цезар", priceBgn: "18.99", priceEur: "9.71", isAvailable: true, sortOrder: 10 },
      { categoryId: catSalads, name: "Caesar with Beef", nameEn: "Caesar with Beef", weight: "250г", description: "Айсберг, телешко филе, пармезан, крутони, дресинг Цезар", priceBgn: "24.99", priceEur: "12.78", isAvailable: true, sortOrder: 11 },
      { categoryId: catSalads, name: "Caesar with Shrimps", nameEn: "Caesar with Shrimps", weight: "250г", description: "Айсберг, скариди, пармезан, крутони, дресинг Цезар", priceBgn: "24.99", priceEur: "12.78", isAvailable: true, sortOrder: 12 },
    ]);

    // === APPETIZER (IMG_0110) ===
    await db.insert(products).values([
      { categoryId: catAppetizer, name: "Haydari", nameEn: "Haydari", weight: "150г", description: "Йогуртова разядка с чесън и подправки", priceBgn: "8.99", priceEur: "4.60", isAvailable: true, sortOrder: 1 },
      { categoryId: catAppetizer, name: "Marinated Bonito", nameEn: "Marinated Bonito", weight: "120г", description: "Маринован паламуд", priceBgn: "16.99", priceEur: "8.69", isAvailable: true, sortOrder: 2 },
      { categoryId: catAppetizer, name: "Marinated Sea Bass", nameEn: "Marinated Sea Bass", weight: "120г", description: "Маринован лаврак", priceBgn: "16.99", priceEur: "8.69", isAvailable: true, sortOrder: 3 },
      { categoryId: catAppetizer, name: "Grilled Red Peppers", nameEn: "Grilled Red Peppers", weight: "200г", description: "Печени червени чушки", priceBgn: "9.99", priceEur: "5.11", isAvailable: true, sortOrder: 4 },
      { categoryId: catAppetizer, name: "Chilli Peppers", nameEn: "Chilli Peppers", weight: "200г", description: "Лютиви чушлета", priceBgn: "9.99", priceEur: "5.11", isAvailable: true, sortOrder: 5 },
      { categoryId: catAppetizer, name: "Taggiasca Olives", nameEn: "Taggiasca Olives", weight: "120г", description: "Маслини Таджиаска", priceBgn: "9.99", priceEur: "5.11", isAvailable: true, sortOrder: 6 },
    ]);

    // === BREAD (IMG_0110) ===
    await db.insert(products).values([
      { categoryId: catBread, name: "White Bread with Herbal Oil", nameEn: "White Bread with Herbal Oil", weight: "200г", description: "Бял хляб с билково масло", priceBgn: "5.99", priceEur: "3.06", isAvailable: true, sortOrder: 1 },
      { categoryId: catBread, name: "Rye Bread with Seeds", nameEn: "Rye Bread with Seeds", weight: "200г", description: "Хляб от ръжено брашно със семена", priceBgn: "5.99", priceEur: "3.06", isAvailable: true, sortOrder: 2 },
      { categoryId: catBread, name: "White Bread", nameEn: "White Bread", weight: "200г", description: "Бял хляб", priceBgn: "4.99", priceEur: "2.55", isAvailable: true, sortOrder: 3 },
    ]);

    // === STARTERS (IMG_0111) ===
    await db.insert(products).values([
      { categoryId: catStarters, name: "Salmon Tartare", nameEn: "Salmon Tartare", weight: "200г", description: "Тартар от сьомга с авокадо и дресинг", priceBgn: "34.99", priceEur: "17.89", isAvailable: true, sortOrder: 1 },
      { categoryId: catStarters, name: "Veal Bon Fillet Tartare", nameEn: "Veal Bon Fillet Tartare", weight: "200г", description: "Тартар от телешко бон филе", priceBgn: "34.99", priceEur: "17.89", isAvailable: true, sortOrder: 2 },
      { categoryId: catStarters, name: "Foie Gras", nameEn: "Foie Gras", weight: "100г", description: "Гъши дроб с конфитюр от смокини", priceBgn: "29.99", priceEur: "15.33", isAvailable: true, sortOrder: 3 },
      { categoryId: catStarters, name: "Crispy Fried Shrimps", nameEn: "Crispy Fried Shrimps", weight: "200г", description: "Хрупкави пържени скариди", priceBgn: "24.99", priceEur: "12.78", isAvailable: true, sortOrder: 4 },
      { categoryId: catStarters, name: "Grilled Calamari", nameEn: "Grilled Calamari", weight: "200г", description: "Калмари на скара", priceBgn: "24.99", priceEur: "12.78", isAvailable: true, sortOrder: 5 },
      { categoryId: catStarters, name: "Fried Calamari", nameEn: "Fried Calamari", weight: "200г", description: "Пържени калмари", priceBgn: "22.99", priceEur: "11.75", isAvailable: true, sortOrder: 6 },
      { categoryId: catStarters, name: "Grilled Octopus", nameEn: "Grilled Octopus", weight: "200г", description: "Октопод на скара", priceBgn: "36.99", priceEur: "18.92", isAvailable: true, sortOrder: 7 },
      { categoryId: catStarters, name: "Shrimps with Garlic Dill & White Wine", nameEn: "Shrimps with Garlic Dill & White Wine", weight: "200г", description: "Скариди с чесън, копър и бяло вино", priceBgn: "24.99", priceEur: "12.78", isAvailable: true, sortOrder: 8 },
      { categoryId: catStarters, name: "Shrimps in Butter", nameEn: "Shrimps in Butter", weight: "200г", description: "Скариди в масло", priceBgn: "29.99", priceEur: "15.33", isAvailable: true, sortOrder: 9 },
      { categoryId: catStarters, name: "Grilled Jumbo Shrimps", nameEn: "Grilled Jumbo Shrimps", weight: "200г", description: "Големи скариди на скара", priceBgn: "36.99", priceEur: "18.92", isAvailable: true, sortOrder: 10 },
      { categoryId: catStarters, name: "Grilled Goat Cheese", nameEn: "Grilled Goat Cheese", weight: "200г", description: "Козе сирене на скара", priceBgn: "18.99", priceEur: "9.71", isAvailable: true, sortOrder: 11 },
      { categoryId: catStarters, name: "Beef Tongue in Butter", nameEn: "Beef Tongue in Butter", weight: "200г", description: "Телешки език в масло", priceBgn: "22.99", priceEur: "11.75", isAvailable: true, sortOrder: 12 },
    ]);

    // === BEEF (IMG_0112) ===
    await db.insert(products).values([
      { categoryId: catBeef, name: "Rib-Eye Steak", nameEn: "Rib-Eye Steak", weight: "300г", description: "САШ 100% Блек Ангъс, всички стекове се приготвят на дървени въглища / US Beef 100% Black Angus, charcoal grilled", priceBgn: "109.00", priceEur: "56.24", isAvailable: true, sortOrder: 1 },
      { categoryId: catBeef, name: "Entrecote", nameEn: "Entrecote", weight: "300г", description: "САШ 100% Блек Ангъс, дървени въглища / US Beef 100% Black Angus, charcoal grilled", priceBgn: "109.00", priceEur: "56.24", isAvailable: true, sortOrder: 2 },
      { categoryId: catBeef, name: "Tenderloin Wagyu Miyazaki A5", nameEn: "Tenderloin Wagyu Miyazaki A5", weight: "100г", description: "Тендерлойн Уагю Миядзаки А5 / Japanese Wagyu beef", priceBgn: "179.00", priceEur: "92.04", isAvailable: true, sortOrder: 3 },
      { categoryId: catBeef, name: "Tenderloin Pave", nameEn: "Tenderloin Pave", weight: "300г", description: "Филе миньон Паве / Tenderloin pave steak", priceBgn: "89.00", priceEur: "45.52", isAvailable: true, sortOrder: 4 },
      { categoryId: catBeef, name: "Tenderloin Medallions", nameEn: "Tenderloin Medallions", weight: "300г", description: "Медальони от бон филе / Tenderloin medallions", priceBgn: "89.00", priceEur: "45.52", isAvailable: true, sortOrder: 5 },
      { categoryId: catBeef, name: "New York Steak", nameEn: "New York Steak", weight: "300г", description: "Ню Йорк стейк / New York strip steak", priceBgn: "99.99", priceEur: "51.12", isAvailable: true, sortOrder: 6 },
      { categoryId: catBeef, name: "Dallas Steak", nameEn: "Dallas Steak", weight: "500г", description: "Далас стейк / Dallas steak", priceBgn: "145.99", priceEur: "74.66", isAvailable: true, sortOrder: 7 },
      { categoryId: catBeef, name: "T-Bone Steak", nameEn: "T-Bone Steak", weight: "100г", description: "Т-бон стейк, мин. тегло 500гр. / T-bone steak, min. weight 500g", priceBgn: "29.99", priceEur: "15.33", isAvailable: true, sortOrder: 8 },
      { categoryId: catBeef, name: "Fiorentina Steak", nameEn: "Fiorentina Steak", weight: "100г", description: "Фиорентина стейк, мин. тегло 900гр. / Fiorentina steak, min. weight 900g", priceBgn: "29.99", priceEur: "15.33", isAvailable: true, sortOrder: 9 },
      { categoryId: catBeef, name: "Tomahawk Steak", nameEn: "Tomahawk Steak", weight: "100г", description: "Томахоук стейк, мин. тегло 1 кг. / Tomahawk steak, min. weight 1kg", priceBgn: "29.99", priceEur: "15.33", isAvailable: true, sortOrder: 10 },
    ]);

    // === LAMB (IMG_0113) ===
    await db.insert(products).values([
      { categoryId: catLamb, name: "Lamb Cutlets", nameEn: "Lamb Cutlets", weight: "350г", description: "Агнешки котлети / Grilled lamb cutlets", priceBgn: "55.99", priceEur: "28.63", isAvailable: true, sortOrder: 1 },
      { categoryId: catLamb, name: "Lamb Shank", nameEn: "Lamb Shank", weight: "350г", description: "Агнешко джоланче / Slow cooked lamb shank", priceBgn: "38.99", priceEur: "19.04", isAvailable: true, sortOrder: 2 },
      { categoryId: catLamb, name: "Lamb Bon Fillet / Turkish Delight", nameEn: "Lamb Bon Fillet / Turkish Delight", weight: "350г", description: "Агнешки локум / Lamb tenderloin, Turkish style", priceBgn: "59.99", priceEur: "30.67", isAvailable: true, sortOrder: 3 },
      { categoryId: catLamb, name: "Lamb Speciality of the Chef", nameEn: "Lamb Speciality of the Chef", weight: "1500г", description: "Агнешки шеф кафез, специалитет на майстора / Chef's special lamb dish", priceBgn: "199.99", priceEur: "102.26", isAvailable: true, sortOrder: 4 },
    ]);

    // === POULTRY (IMG_0113) ===
    await db.insert(products).values([
      { categoryId: catPoultry, name: "Duck Magret", nameEn: "Duck Magret", weight: "350г", description: "Патешко магре с картофено пюре, аспержи и сладко от вишни / With mashed potatoes, asparagus and cherry jam", priceBgn: "37.99", priceEur: "19.43", isAvailable: true, sortOrder: 1 },
      { categoryId: catPoultry, name: "Chicken Bon Fillet", nameEn: "Chicken Bon Fillet", weight: "300г", description: "Пилешко бон филе / Chicken tenderloin", priceBgn: "25.99", priceEur: "13.29", isAvailable: true, sortOrder: 2 },
    ]);

    // === FISH (IMG_0113) ===
    await db.insert(products).values([
      { categoryId: catFish, name: "Sultan Guvec", nameEn: "Sultan Guvec", weight: "600г", description: "Октопод, скариди, калмари, червени чушки, зелени чушки, чери домати, чесън и масло / Octopus, shrimps, squid, red pepper, green pepper, cherry tomatoes, garlic and butter", priceBgn: "119.99", priceEur: "61.36", isAvailable: true, sortOrder: 1 },
      { categoryId: catFish, name: "Sea Bass Fillet", nameEn: "Sea Bass Fillet", weight: "400/600г", description: "Лаврак филе / Sea bass fillet", priceBgn: "33.99", priceEur: "17.38", isAvailable: true, sortOrder: 2 },
      { categoryId: catFish, name: "Salmon Fillet", nameEn: "Salmon Fillet", weight: "250г", description: "Сьомга филе / Salmon fillet", priceBgn: "28.99", priceEur: "14.82", isAvailable: true, sortOrder: 3 },
      { categoryId: catFish, name: "Sea Bass on Grill", nameEn: "Sea Bass on Grill", weight: "400/600г", description: "Лаврак на скара / Grilled sea bass", priceBgn: "33.99", priceEur: "17.38", isAvailable: true, sortOrder: 4 },
      { categoryId: catFish, name: "Grilled Seabream", nameEn: "Grilled Seabream", weight: "400/600г", description: "Ципура на скара / Grilled seabream", priceBgn: "33.99", priceEur: "17.38", isAvailable: true, sortOrder: 5 },
    ]);

    // === DESSERTS (IMG_0114) ===
    await db.insert(products).values([
      { categoryId: catDesserts, name: "Baklava", nameEn: "Baklava", weight: "150г", description: "Традиционна баклава", priceBgn: "14.99", priceEur: "7.66", isAvailable: true, sortOrder: 1 },
      { categoryId: catDesserts, name: "Katmer", nameEn: "Katmer", weight: "150г", description: "Катмер - турска сладост", priceBgn: "14.99", priceEur: "7.66", isAvailable: true, sortOrder: 2 },
      { categoryId: catDesserts, name: "Katmer Rose", nameEn: "Katmer Rose", weight: "150г", description: "Катмер Роза / Katmer with rose", priceBgn: "16.99", priceEur: "8.69", isAvailable: true, sortOrder: 3 },
      { categoryId: catDesserts, name: "Kunefe", nameEn: "Kunefe", weight: "150г", description: "Кюнефе - традиционен турски десерт", priceBgn: "14.99", priceEur: "7.66", isAvailable: true, sortOrder: 4 },
      { categoryId: catDesserts, name: "Sutlach", nameEn: "Sutlach", weight: "150г", description: "Сютляш - оризов пудинг", priceBgn: "11.99", priceEur: "6.13", isAvailable: true, sortOrder: 5 },
      { categoryId: catDesserts, name: "Lava Cake", nameEn: "Lava Cake", weight: "150г", description: "Лава кейк / Chocolate lava cake", priceBgn: "13.99", priceEur: "7.16", isAvailable: true, sortOrder: 6 },
      { categoryId: catDesserts, name: "Baklava with Cocoa, Milk & Pistachios", nameEn: "Baklava with Cocoa, Milk & Pistachios", weight: "150г", description: "Баклава с какао, мляко и шам фъстък", priceBgn: "14.99", priceEur: "7.66", isAvailable: true, sortOrder: 7 },
      { categoryId: catDesserts, name: "Burma Kadaif with Pistachio", nameEn: "Burma Kadaif with Pistachio", weight: "200г", description: "Бурма кадаиф с шам фъстък", priceBgn: "15.99", priceEur: "8.18", isAvailable: true, sortOrder: 8 },
      { categoryId: catDesserts, name: "Sorbet with Forest Fruits", nameEn: "Sorbet with Forest Fruits", weight: "150г", description: "Плодово сорбе с горски плодове", priceBgn: "10.99", priceEur: "5.62", isAvailable: true, sortOrder: 9 },
      { categoryId: catDesserts, name: "Ice Cream", nameEn: "Ice Cream", weight: "80г", description: "Сладолед / Ice cream", priceBgn: "5.99", priceEur: "3.06", isAvailable: true, sortOrder: 10 },
    ]);

    // === WHISKEY - Scottish (IMG_0115) ===
    await db.insert(products).values([
      { categoryId: catWhiskey, name: "Ballantines Finest", nameEn: "Ballantines Finest", weight: "50мл", description: "Шотландско уиски / Scotch whiskey", priceBgn: "7.99", priceEur: "4.09", isAvailable: true, sortOrder: 1 },
      { categoryId: catWhiskey, name: "Ballantines 7YO", nameEn: "Ballantines 7YO", weight: "50мл", description: "Шотландско уиски 7 год. / Scotch whiskey 7 years", priceBgn: "7.99", priceEur: "4.09", isAvailable: true, sortOrder: 2 },
      { categoryId: catWhiskey, name: "Ballantines 12YO", nameEn: "Ballantines 12YO", weight: "50мл", description: "Шотландско уиски 12 год. / Scotch whiskey 12 years", priceBgn: "11.99", priceEur: "6.13", isAvailable: true, sortOrder: 3 },
      { categoryId: catWhiskey, name: "Chivas Regal 12YO", nameEn: "Chivas Regal 12YO", weight: "50мл", description: "Чивас Ригъл 12 год. / Chivas Regal 12 years", priceBgn: "12.99", priceEur: "6.64", isAvailable: true, sortOrder: 4 },
      { categoryId: catWhiskey, name: "Chivas Regal Extra 13YO", nameEn: "Chivas Regal Extra 13YO", weight: "50мл", description: "Чивас Ригъл Екстра 13 год. / Chivas Regal Extra 13 years", priceBgn: "15.99", priceEur: "8.18", isAvailable: true, sortOrder: 5 },
      { categoryId: catWhiskey, name: "Chivas Regal 15YO", nameEn: "Chivas Regal 15YO", weight: "50мл", description: "Чивас Ригъл 15 год. / Chivas Regal 15 years", priceBgn: "19.99", priceEur: "10.22", isAvailable: true, sortOrder: 6 },
      { categoryId: catWhiskey, name: "Chivas Regal Mizunara", nameEn: "Chivas Regal Mizunara", weight: "50мл", description: "Чивас Ригъл Мизунара / Chivas Regal Mizunara", priceBgn: "21.99", priceEur: "11.25", isAvailable: true, sortOrder: 7 },
      { categoryId: catWhiskey, name: "Chivas Regal 18YO", nameEn: "Chivas Regal 18YO", weight: "50мл", description: "Чивас Ригъл 18 год. / Chivas Regal 18 years", priceBgn: "29.99", priceEur: "15.33", isAvailable: true, sortOrder: 8 },
      { categoryId: catWhiskey, name: "Royal Salute 21YO", nameEn: "Royal Salute 21YO", weight: "50мл", description: "Роял Салут 21 год. / Royal Salute 21 years", priceBgn: "69.00", priceEur: "35.28", isAvailable: true, sortOrder: 9 },
      { categoryId: catWhiskey, name: "Glenlivet Founders Reserve", nameEn: "Glenlivet Founders Reserve", weight: "50мл", description: "Гленливет Фаундърс Резерв / Glenlivet Founders Reserve", priceBgn: "14.99", priceEur: "7.66", isAvailable: true, sortOrder: 10 },
      { categoryId: catWhiskey, name: "Glenlivet 12YO", nameEn: "Glenlivet 12YO", weight: "50мл", description: "Гленливет 12 год. / Glenlivet 12 years", priceBgn: "17.99", priceEur: "9.20", isAvailable: true, sortOrder: 11 },
    ]);

    // === WHISKEY - Single Malt (IMG_0116) ===
    await db.insert(products).values([
      { categoryId: catWhiskey, name: "Cardhu 15YO", nameEn: "Cardhu 15YO", weight: "50мл", description: "Кардю 15 год. / Single malt Scotch whisky", priceBgn: "27.99", priceEur: "14.31", isAvailable: true, sortOrder: 12 },
      { categoryId: catWhiskey, name: "Cardhu 18YO", nameEn: "Cardhu 18YO", weight: "50мл", description: "Кардю 18 год. / Single malt Scotch whisky", priceBgn: "52.99", priceEur: "27.09", isAvailable: true, sortOrder: 13 },
      { categoryId: catWhiskey, name: "Talisker 15YO", nameEn: "Talisker 15YO", weight: "50мл", description: "Талискер 15 год. / Single malt Scotch whisky", priceBgn: "32.99", priceEur: "16.87", isAvailable: true, sortOrder: 14 },
      { categoryId: catWhiskey, name: "Talisker 18YO", nameEn: "Talisker 18YO", weight: "50мл", description: "Талискер 18 год. / Single malt Scotch whisky", priceBgn: "69.99", priceEur: "35.78", isAvailable: true, sortOrder: 15 },
      { categoryId: catWhiskey, name: "Singleton of Dufftown 15YO", nameEn: "Singleton of Dufftown 15YO", weight: "50мл", description: "Сингълтън Дъфтаун 15 год. / Single malt Scotch whisky", priceBgn: "23.99", priceEur: "12.27", isAvailable: true, sortOrder: 16 },
      { categoryId: catWhiskey, name: "Singleton of Dufftown 18YO", nameEn: "Singleton of Dufftown 18YO", weight: "50мл", description: "Сингълтън Дъфтаун 18 год. / Single malt Scotch whisky", priceBgn: "32.99", priceEur: "16.87", isAvailable: true, sortOrder: 17 },
    ]);

    // === WHISKEY - American (IMG_0116) ===
    await db.insert(products).values([
      { categoryId: catWhiskey, name: "Four Roses", nameEn: "Four Roses", weight: "50мл", description: "Фоур Роузес / American bourbon whiskey", priceBgn: "9.99", priceEur: "5.11", isAvailable: true, sortOrder: 18 },
      { categoryId: catWhiskey, name: "Four Roses Small Batch", nameEn: "Four Roses Small Batch", weight: "50мл", description: "Фоур Роузес Смол Бач / American bourbon whiskey", priceBgn: "12.99", priceEur: "6.64", isAvailable: true, sortOrder: 19 },
      { categoryId: catWhiskey, name: "Four Roses Single Barrel", nameEn: "Four Roses Single Barrel", weight: "50мл", description: "Фоур Роузес Сингъл Барел / American bourbon whiskey", priceBgn: "16.99", priceEur: "8.69", isAvailable: true, sortOrder: 20 },
      { categoryId: catWhiskey, name: "Gentleman Jack", nameEn: "Gentleman Jack", weight: "50мл", description: "Джентълмън Джак / Tennessee whiskey", priceBgn: "16.99", priceEur: "8.69", isAvailable: true, sortOrder: 21 },
      { categoryId: catWhiskey, name: "Hudson", nameEn: "Hudson", weight: "50мл", description: "Хъдсън / American whiskey", priceBgn: "21.99", priceEur: "11.25", isAvailable: true, sortOrder: 22 },
    ]);

    // === GIN (IMG_0117) ===
    await db.insert(products).values([
      { categoryId: catGinRum, name: "Beefeater Gin", nameEn: "Beefeater Gin", weight: "50мл", description: "Бифитър Джин / London dry gin", priceBgn: "7.99", priceEur: "4.09", isAvailable: true, sortOrder: 1 },
      { categoryId: catGinRum, name: "Beefeater Pink/Orange", nameEn: "Beefeater Pink/Orange", weight: "50мл", description: "Бифитър Пинк/Портокал / Flavored gin", priceBgn: "7.99", priceEur: "4.09", isAvailable: true, sortOrder: 2 },
      { categoryId: catGinRum, name: "Beefeater 24", nameEn: "Beefeater 24", weight: "50мл", description: "Бифитър 24 / Premium London dry gin", priceBgn: "12.99", priceEur: "6.64", isAvailable: true, sortOrder: 3 },
      { categoryId: catGinRum, name: "Malfy Varieties", nameEn: "Malfy Varieties", weight: "50мл", description: "Малфи / Original, Citron, Rosa, Blood Orange", priceBgn: "14.99", priceEur: "7.66", isAvailable: true, sortOrder: 4 },
      { categoryId: catGinRum, name: "Plymouth Sloe", nameEn: "Plymouth Sloe", weight: "50мл", description: "Плимът Слоу / Sloe gin", priceBgn: "12.99", priceEur: "6.64", isAvailable: true, sortOrder: 5 },
      { categoryId: catGinRum, name: "Plymouth", nameEn: "Plymouth", weight: "50мл", description: "Плимът / English gin", priceBgn: "14.99", priceEur: "7.66", isAvailable: true, sortOrder: 6 },
      { categoryId: catGinRum, name: "Monkey 47 Ultra Premium Gin", nameEn: "Monkey 47 Ultra Premium Gin", weight: "50мл", description: "Мънки 47 / Ultra premium German gin", priceBgn: "22.99", priceEur: "11.75", isAvailable: true, sortOrder: 7 },
      { categoryId: catGinRum, name: "Hendrick's Gin", nameEn: "Hendrick's Gin", weight: "50мл", description: "Хендрикс / Premium Scottish gin", priceBgn: "12.99", priceEur: "6.64", isAvailable: true, sortOrder: 8 },
    ]);

    // === RUM (IMG_0117 + IMG_0118) ===
    await db.insert(products).values([
      { categoryId: catGinRum, name: "Malibu", nameEn: "Malibu", weight: "50мл", description: "Малибу / Coconut rum liqueur", priceBgn: "6.99", priceEur: "3.57", isAvailable: true, sortOrder: 9 },
      { categoryId: catGinRum, name: "Havana Club 3Y", nameEn: "Havana Club 3Y", weight: "50мл", description: "Хавана Клуб 3 год. / Cuban rum", priceBgn: "9.99", priceEur: "5.11", isAvailable: true, sortOrder: 10 },
      { categoryId: catGinRum, name: "Havana Club Anejo Especial", nameEn: "Havana Club Anejo Especial", weight: "50мл", description: "Хавана Клуб Аниехо Еспесиал / Cuban rum", priceBgn: "9.99", priceEur: "5.11", isAvailable: true, sortOrder: 11 },
      { categoryId: catGinRum, name: "Havana Club 7Y", nameEn: "Havana Club 7Y", weight: "50мл", description: "Хавана Клуб 7 год. / Premium Cuban rum", priceBgn: "10.99", priceEur: "5.62", isAvailable: true, sortOrder: 12 },
      { categoryId: catGinRum, name: "Sailor Jerry Rum", nameEn: "Sailor Jerry Rum", weight: "50мл", description: "Сейлър Джери / Spiced rum", priceBgn: "9.99", priceEur: "5.11", isAvailable: true, sortOrder: 13 },
      { categoryId: catGinRum, name: "La Hechicera Reserva Familiar", nameEn: "La Hechicera Reserva Familiar", weight: "50мл", description: "Ла Есисера Резерва Фамилиар / Colombian rum", priceBgn: "18.99", priceEur: "9.71", isAvailable: true, sortOrder: 14 },
      { categoryId: catGinRum, name: "La Hechicera Experimental", nameEn: "La Hechicera Experimental", weight: "50мл", description: "Ла Есисера Експериментал / Colombian rum", priceBgn: "19.99", priceEur: "10.22", isAvailable: true, sortOrder: 15 },
      { categoryId: catGinRum, name: "Zacapa", nameEn: "Zacapa", weight: "50мл", description: "Закапа / Guatemalan rum", priceBgn: "23.99", priceEur: "12.27", isAvailable: true, sortOrder: 16 },
      { categoryId: catGinRum, name: "Boukman", nameEn: "Boukman", weight: "50мл", description: "Ботаниста / Haitian rum", priceBgn: "18.99", priceEur: "9.71", isAvailable: true, sortOrder: 17 },
    ]);

    // === VODKA (IMG_0118) ===
    await db.insert(products).values([
      { categoryId: catVodka, name: "Absolut", nameEn: "Absolut", weight: "50мл", description: "Абсолют / Swedish vodka", priceBgn: "7.99", priceEur: "4.09", isAvailable: true, sortOrder: 1 },
      { categoryId: catVodka, name: "Absolut Elyx", nameEn: "Absolut Elyx", weight: "50мл", description: "Абсолют Еликс / Premium Swedish vodka", priceBgn: "16.99", priceEur: "8.69", isAvailable: true, sortOrder: 2 },
      { categoryId: catVodka, name: "Ostoya Vodka", nameEn: "Ostoya Vodka", weight: "50мл", description: "Остоя / Polish vodka", priceBgn: "11.99", priceEur: "6.13", isAvailable: true, sortOrder: 3 },
      { categoryId: catVodka, name: "Beluga Noble", nameEn: "Beluga Noble", weight: "50мл", description: "Белуга Нобел / Russian vodka", priceBgn: "18.99", priceEur: "9.71", isAvailable: true, sortOrder: 4 },
      { categoryId: catVodka, name: "Beluga Transatlantic", nameEn: "Beluga Transatlantic", weight: "50мл", description: "Белуга Трансатлантик / Premium Russian vodka", priceBgn: "24.99", priceEur: "12.78", isAvailable: true, sortOrder: 5 },
      { categoryId: catVodka, name: "Beluga Gold Line", nameEn: "Beluga Gold Line", weight: "50мл", description: "Белуга Голд Лайн / Luxury Russian vodka", priceBgn: "49.99", priceEur: "25.56", isAvailable: true, sortOrder: 6 },
      { categoryId: catVodka, name: "Grey Goose", nameEn: "Grey Goose", weight: "50мл", description: "Грей Гус / French vodka", priceBgn: "18.99", priceEur: "9.71", isAvailable: true, sortOrder: 7 },
    ]);

    // === ANISE DRINKS (IMG_0118 + IMG_0119) ===
    await db.insert(products).values([
      { categoryId: catAnise, name: "Pernod / Ricard", nameEn: "Pernod / Ricard", weight: "50мл", description: "Перно / Рикар / French anise spirit", priceBgn: "7.99", priceEur: "4.09", isAvailable: true, sortOrder: 1 },
      { categoryId: catAnise, name: "Ricard 200ml", nameEn: "Ricard 200ml", weight: "200мл", description: "Рикар / French pastis", priceBgn: "22.99", priceEur: "11.75", isAvailable: true, sortOrder: 2 },
      { categoryId: catAnise, name: "Pernod Absinthe", nameEn: "Pernod Absinthe", weight: "50мл", description: "Перно Абсент / French absinthe", priceBgn: "6.99", priceEur: "3.57", isAvailable: true, sortOrder: 3 },
      { categoryId: catAnise, name: "Ouzo Mini", nameEn: "Ouzo Mini", weight: "50мл", description: "Узо Мини / Greek ouzo", priceBgn: "7.99", priceEur: "4.09", isAvailable: true, sortOrder: 4 },
      { categoryId: catAnise, name: "Ouzo Plomari Adolo", nameEn: "Ouzo Plomari Adolo", weight: "50мл", description: "Узо Пломари Адоло / Greek ouzo", priceBgn: "9.99", priceEur: "5.11", isAvailable: true, sortOrder: 5 },
      { categoryId: catAnise, name: "Yeni Raki", nameEn: "Yeni Raki", weight: "50мл", description: "Йени Раки / Turkish raki", priceBgn: "6.99", priceEur: "3.57", isAvailable: true, sortOrder: 6 },
      { categoryId: catAnise, name: "Yeni Raki 200ml", nameEn: "Yeni Raki 200ml", weight: "200мл", description: "Йени Раки / Turkish raki", priceBgn: "23.99", priceEur: "12.27", isAvailable: true, sortOrder: 7 },
      { categoryId: catAnise, name: "Tekirdag Gold", nameEn: "Tekirdag Gold", weight: "50мл", description: "Текирдаг Голд / Turkish raki", priceBgn: "9.99", priceEur: "5.11", isAvailable: true, sortOrder: 8 },
      { categoryId: catAnise, name: "Tekirdag Gold 200ml", nameEn: "Tekirdag Gold 200ml", weight: "200мл", description: "Текирдаг Голд / Turkish raki", priceBgn: "35.99", priceEur: "18.40", isAvailable: true, sortOrder: 9 },
      { categoryId: catAnise, name: "Tekirdag", nameEn: "Tekirdag", weight: "50мл", description: "Текирдаг / Turkish raki", priceBgn: "6.99", priceEur: "3.57", isAvailable: true, sortOrder: 10 },
      { categoryId: catAnise, name: "Tekirdag 200ml", nameEn: "Tekirdag 200ml", weight: "200мл", description: "Текирдаг / Turkish raki", priceBgn: "22.99", priceEur: "11.75", isAvailable: true, sortOrder: 11 },
      { categoryId: catAnise, name: "Beylerbeyi Gobek", nameEn: "Beylerbeyi Gobek", weight: "50мл", description: "Бейлербейи Гьобек / Premium Turkish raki", priceBgn: "9.99", priceEur: "5.11", isAvailable: true, sortOrder: 12 },
      { categoryId: catAnise, name: "Beylerbeyi Gobek 200ml", nameEn: "Beylerbeyi Gobek 200ml", weight: "200мл", description: "Бейлербейи Гьобек / Premium Turkish raki", priceBgn: "49.99", priceEur: "25.56", isAvailable: true, sortOrder: 13 },
      { categoryId: catAnise, name: "Ouzo Babatzim", nameEn: "Ouzo Babatzim", weight: "50мл", description: "Узо Бабадзим / Greek ouzo", priceBgn: "6.99", priceEur: "3.57", isAvailable: true, sortOrder: 14 },
      { categoryId: catAnise, name: "Ouzo Babatzim Classic 100%", nameEn: "Ouzo Babatzim Classic 100%", weight: "50мл", description: "Узо Бабадзим Класик 100% / Greek ouzo", priceBgn: "6.99", priceEur: "3.57", isAvailable: true, sortOrder: 15 },
    ]);

    // === RAKIA (IMG_0119) ===
    await db.insert(products).values([
      { categoryId: catRakia, name: "Straldjanska Muscat Matured", nameEn: "Straldjanska Muscat Matured", weight: "50мл", description: "Стралджанска мускатова отлежала / Bulgarian rakia", priceBgn: "4.99", priceEur: "2.55", isAvailable: true, sortOrder: 1 },
      { categoryId: catRakia, name: "Straldjanska Muscat Barrel", nameEn: "Straldjanska Muscat Barrel", weight: "50мл", description: "Стралджанска мускатова барел / Bulgarian rakia", priceBgn: "5.99", priceEur: "3.06", isAvailable: true, sortOrder: 2 },
      { categoryId: catRakia, name: "Slivenska Perla", nameEn: "Slivenska Perla", weight: "50мл", description: "Сливенска перла / Bulgarian rakia", priceBgn: "4.99", priceEur: "2.55", isAvailable: true, sortOrder: 3 },
      { categoryId: catRakia, name: "Slivenska Perla Barrel", nameEn: "Slivenska Perla Barrel", weight: "50мл", description: "Сливенска перла барел / Bulgarian rakia", priceBgn: "5.99", priceEur: "3.06", isAvailable: true, sortOrder: 4 },
      { categoryId: catRakia, name: "Sungularska Special", nameEn: "Sungularska Special", weight: "50мл", description: "Сунгуларска специална / Bulgarian rakia", priceBgn: "4.99", priceEur: "2.55", isAvailable: true, sortOrder: 5 },
      { categoryId: catRakia, name: "Cultural", nameEn: "Cultural", weight: "50мл", description: "Културна / Premium Bulgarian rakia", priceBgn: "18.99", priceEur: "9.71", isAvailable: true, sortOrder: 6 },
      { categoryId: catRakia, name: "Branko Quince Premium", nameEn: "Branko Quince Premium", weight: "50мл", description: "Бранко кайсиева премиум / Premium quince rakia", priceBgn: "14.99", priceEur: "7.66", isAvailable: true, sortOrder: 7 },
      { categoryId: catRakia, name: "Branko Plum Premium", nameEn: "Branko Plum Premium", weight: "50мл", description: "Бранко сливова премиум / Premium plum rakia", priceBgn: "15.99", priceEur: "8.18", isAvailable: true, sortOrder: 8 },
    ]);

    // === LIQUORS & DIGESTIF (IMG_0120) ===
    await db.insert(products).values([
      { categoryId: catLiquors, name: "Bailey's / Kahlua", nameEn: "Bailey's / Kahlua", weight: "50мл", description: "Бейлис / Калуа / Cream liqueur", priceBgn: "6.99", priceEur: "3.57", isAvailable: true, sortOrder: 1 },
      { categoryId: catLiquors, name: "Ramazzotti Amaro", nameEn: "Ramazzotti Amaro", weight: "50мл", description: "Рамацоти Амаро / Italian amaro", priceBgn: "6.99", priceEur: "3.57", isAvailable: true, sortOrder: 2 },
      { categoryId: catLiquors, name: "Martini Bianco", nameEn: "Martini Bianco", weight: "50мл", description: "Мартини Бянко / Vermouth", priceBgn: "6.99", priceEur: "3.57", isAvailable: true, sortOrder: 3 },
      { categoryId: catLiquors, name: "Aperol", nameEn: "Aperol", weight: "50мл", description: "Аперол / Italian aperitif", priceBgn: "6.99", priceEur: "3.57", isAvailable: true, sortOrder: 4 },
      { categoryId: catLiquors, name: "Campari", nameEn: "Campari", weight: "50мл", description: "Кампари / Italian aperitif", priceBgn: "6.99", priceEur: "3.57", isAvailable: true, sortOrder: 5 },
      { categoryId: catLiquors, name: "Cointreau", nameEn: "Cointreau", weight: "50мл", description: "Коантро / Orange liqueur", priceBgn: "7.99", priceEur: "4.09", isAvailable: true, sortOrder: 6 },
      { categoryId: catLiquors, name: "Limoncello", nameEn: "Limoncello", weight: "50мл", description: "Лимончело / Italian lemon liqueur", priceBgn: "6.99", priceEur: "3.57", isAvailable: true, sortOrder: 7 },
      { categoryId: catLiquors, name: "SkinOS", nameEn: "SkinOS", weight: "50мл", description: "Скинос / Greek spirit", priceBgn: "6.99", priceEur: "3.57", isAvailable: true, sortOrder: 8 },
      { categoryId: catLiquors, name: "Jagermeister", nameEn: "Jagermeister", weight: "50мл", description: "Йегермайстер / German herbal liqueur", priceBgn: "6.99", priceEur: "3.57", isAvailable: true, sortOrder: 9 },
      { categoryId: catLiquors, name: "Fernet Branca Menta", nameEn: "Fernet Branca Menta", weight: "50мл", description: "Фернет Бранка мента / Mint liqueur", priceBgn: "6.99", priceEur: "3.57", isAvailable: true, sortOrder: 10 },
      { categoryId: catLiquors, name: "Hennessy XO", nameEn: "Hennessy XO", weight: "50мл", description: "Хенеси ХО / Cognac XO", priceBgn: "49.00", priceEur: "25.06", isAvailable: true, sortOrder: 11 },
      { categoryId: catLiquors, name: "Martell VSOP", nameEn: "Martell VSOP", weight: "50мл", description: "Мартел ВСОП / Cognac VSOP", priceBgn: "12.99", priceEur: "6.64", isAvailable: true, sortOrder: 12 },
    ]);

    // === TEQUILA (IMG_0120 + IMG_0121) ===
    await db.insert(products).values([
      { categoryId: catTequila, name: "Olmeca Silver", nameEn: "Olmeca Silver", weight: "25мл", description: "Олмека Силвър / Mexican tequila", priceBgn: "4.99", priceEur: "2.55", isAvailable: true, sortOrder: 1 },
      { categoryId: catTequila, name: "Olmeca Gold", nameEn: "Olmeca Gold", weight: "25мл", description: "Олмека Голд / Mexican tequila", priceBgn: "4.99", priceEur: "2.55", isAvailable: true, sortOrder: 2 },
      { categoryId: catTequila, name: "Olmeca Altos Gold", nameEn: "Olmeca Altos Gold", weight: "25мл", description: "Олмека Алтос Голд / Premium tequila", priceBgn: "6.99", priceEur: "3.57", isAvailable: true, sortOrder: 3 },
      { categoryId: catTequila, name: "Avion", nameEn: "Avion", weight: "25мл", description: "Авион / Premium tequila", priceBgn: "8.00", priceEur: "4.09", isAvailable: true, sortOrder: 4 },
      { categoryId: catTequila, name: "Patron Silver", nameEn: "Patron Silver", weight: "25мл", description: "Патрон Силвър / Premium tequila", priceBgn: "10.99", priceEur: "5.62", isAvailable: true, sortOrder: 5 },
      { categoryId: catTequila, name: "After Shock Blue", nameEn: "After Shock Blue", weight: "25мл", description: "Афтър Шок / Cinnamon liqueur", priceBgn: "5.49", priceEur: "2.81", isAvailable: true, sortOrder: 6 },
      { categoryId: catTequila, name: "Don Julio", nameEn: "Don Julio", weight: "25мл", description: "Дон Хулио / Premium tequila", priceBgn: "8.99", priceEur: "4.60", isAvailable: true, sortOrder: 7 },
      { categoryId: catTequila, name: "Azul Repossado", nameEn: "Azul Repossado", weight: "1л", description: "Азул Репосадо / Premium tequila", priceBgn: "999.99", priceEur: "511.29", isAvailable: true, sortOrder: 8 },
    ]);

    // === BEER (IMG_0121) ===
    await db.insert(products).values([
      { categoryId: catBeer, name: "Carlsberg Draft", nameEn: "Carlsberg Draft", weight: "330/500мл", description: "Карлсберг наливна / Danish draft beer", priceBgn: "5.99", priceEur: "3.06", isAvailable: true, sortOrder: 1 },
      { categoryId: catBeer, name: "Budweiser", nameEn: "Budweiser", weight: "330мл", description: "Будвайзер / American lager", priceBgn: "6.99", priceEur: "3.57", isAvailable: true, sortOrder: 2 },
      { categoryId: catBeer, name: "Tuborg", nameEn: "Tuborg", weight: "330мл", description: "Туборг / Danish lager", priceBgn: "5.49", priceEur: "2.81", isAvailable: true, sortOrder: 3 },
      { categoryId: catBeer, name: "Shumensko Special", nameEn: "Shumensko Special", weight: "330мл", description: "Шуменско специално / Bulgarian beer", priceBgn: "4.49", priceEur: "2.30", isAvailable: true, sortOrder: 4 },
      { categoryId: catBeer, name: "Carlsberg Bottle", nameEn: "Carlsberg Bottle", weight: "330мл", description: "Карлсберг / Danish pilsner", priceBgn: "6.49", priceEur: "3.32", isAvailable: true, sortOrder: 5 },
      { categoryId: catBeer, name: "Carlsberg Non Alcoholic", nameEn: "Carlsberg Non Alcoholic", weight: "330мл", description: "Карлсберг безалкохолна / Non-alcoholic beer", priceBgn: "6.99", priceEur: "3.57", isAvailable: true, sortOrder: 6 },
      { categoryId: catBeer, name: "Corona", nameEn: "Corona", weight: "355мл", description: "Корона / Mexican lager", priceBgn: "9.99", priceEur: "5.11", isAvailable: true, sortOrder: 7 },
      { categoryId: catBeer, name: "Kronenbourg 1664 Blanc", nameEn: "Kronenbourg 1664 Blanc", weight: "330мл", description: "Кроненбург 1664 Блан / French wheat beer", priceBgn: "7.99", priceEur: "4.09", isAvailable: true, sortOrder: 8 },
      { categoryId: catBeer, name: "Grimbergen", nameEn: "Grimbergen", weight: "330мл", description: "Гримберген / Belgian abbey beer", priceBgn: "8.99", priceEur: "4.60", isAvailable: true, sortOrder: 9 },
      { categoryId: catBeer, name: "Erdinger", nameEn: "Erdinger", weight: "500мл", description: "Ердингер / German wheat beer", priceBgn: "9.99", priceEur: "5.11", isAvailable: true, sortOrder: 10 },
    ]);

    // === SOFT DRINKS (IMG_0121 + IMG_0122) ===
    await db.insert(products).values([
      { categoryId: catSoftDrinks, name: "Coca Cola / Fanta / Sprite / Tonic", nameEn: "Coca Cola / Fanta / Sprite / Tonic", weight: "250мл", description: "Кока Кола / Фанта / Спрайт / Тоник", priceBgn: "4.59", priceEur: "2.35", isAvailable: true, sortOrder: 1 },
      { categoryId: catSoftDrinks, name: "Ice Tea", nameEn: "Ice Tea", weight: "330мл", description: "Студен чай", priceBgn: "4.59", priceEur: "2.35", isAvailable: true, sortOrder: 2 },
      { categoryId: catSoftDrinks, name: "Juice Cappy", nameEn: "Juice Cappy", weight: "250мл", description: "Натурален сок Капи", priceBgn: "4.59", priceEur: "2.35", isAvailable: true, sortOrder: 3 },
      { categoryId: catSoftDrinks, name: "Mineral Water Bankia 330ml", nameEn: "Mineral Water Bankia 330ml", weight: "330мл", description: "Минерална вода Банкя", priceBgn: "3.59", priceEur: "1.84", isAvailable: true, sortOrder: 4 },
      { categoryId: catSoftDrinks, name: "Mineral Water Bankia 1L", nameEn: "Mineral Water Bankia 1L", weight: "1л", description: "Минерална вода Банкя", priceBgn: "5.99", priceEur: "3.06", isAvailable: true, sortOrder: 5 },
      { categoryId: catSoftDrinks, name: "Acqua Panna 250ml", nameEn: "Acqua Panna 250ml", weight: "250мл", description: "Аква Пана / Still water", priceBgn: "4.99", priceEur: "2.55", isAvailable: true, sortOrder: 6 },
      { categoryId: catSoftDrinks, name: "Acqua Panna 750ml", nameEn: "Acqua Panna 750ml", weight: "750мл", description: "Аква Пана / Still water", priceBgn: "9.99", priceEur: "5.11", isAvailable: true, sortOrder: 7 },
      { categoryId: catSoftDrinks, name: "San Pellegrino 250ml", nameEn: "San Pellegrino 250ml", weight: "250мл", description: "Сан Пелегрино / Sparkling water", priceBgn: "5.99", priceEur: "3.06", isAvailable: true, sortOrder: 8 },
      { categoryId: catSoftDrinks, name: "San Pellegrino 750ml", nameEn: "San Pellegrino 750ml", weight: "750мл", description: "Сан Пелегрино / Sparkling water", priceBgn: "10.99", priceEur: "5.62", isAvailable: true, sortOrder: 9 },
      { categoryId: catSoftDrinks, name: "Perrier 330ml", nameEn: "Perrier 330ml", weight: "330мл", description: "Перие / Sparkling water", priceBgn: "7.99", priceEur: "4.09", isAvailable: true, sortOrder: 10 },
      { categoryId: catSoftDrinks, name: "Perrier 750ml", nameEn: "Perrier 750ml", weight: "750мл", description: "Перие / Sparkling water", priceBgn: "10.99", priceEur: "5.62", isAvailable: true, sortOrder: 11 },
      { categoryId: catSoftDrinks, name: "Pelisterka 250ml", nameEn: "Pelisterka 250ml", weight: "250мл", description: "Пелистерка / Sparkling water", priceBgn: "3.99", priceEur: "2.04", isAvailable: true, sortOrder: 12 },
      { categoryId: catSoftDrinks, name: "Pelisterka 750ml", nameEn: "Pelisterka 750ml", weight: "750мл", description: "Пелистерка / Sparkling water", priceBgn: "5.99", priceEur: "3.06", isAvailable: true, sortOrder: 13 },
      { categoryId: catSoftDrinks, name: "Tomas Henri", nameEn: "Tomas Henri", weight: "200мл", description: "Томас Хенри / Tonic water", priceBgn: "7.99", priceEur: "4.09", isAvailable: true, sortOrder: 14 },
      { categoryId: catSoftDrinks, name: "Red Bull", nameEn: "Red Bull", weight: "250мл", description: "Ред Бул / Energy drink", priceBgn: "6.99", priceEur: "3.57", isAvailable: true, sortOrder: 15 },
      { categoryId: catSoftDrinks, name: "Ayran 300ml", nameEn: "Ayran 300ml", weight: "300мл", description: "Айрян / Yogurt drink", priceBgn: "4.50", priceEur: "2.30", isAvailable: true, sortOrder: 16 },
      { categoryId: catSoftDrinks, name: "Ayran 1L", nameEn: "Ayran 1L", weight: "1л", description: "Айрян / Yogurt drink", priceBgn: "13.99", priceEur: "7.16", isAvailable: true, sortOrder: 17 },
    ]);

    // === FRESH JUICES (IMG_0123) ===
    await db.insert(products).values([
      { categoryId: catFresh, name: "Fresh Juice", nameEn: "Fresh Juice", weight: "300мл", description: "Фреш / Fresh squeezed juice", priceBgn: "6.99", priceEur: "3.57", isAvailable: true, sortOrder: 1 },
      { categoryId: catFresh, name: "Lemonade", nameEn: "Lemonade", weight: "400мл", description: "Лимонада / Homemade lemonade", priceBgn: "6.99", priceEur: "3.57", isAvailable: true, sortOrder: 2 },
      { categoryId: catFresh, name: "Lemonade 1L", nameEn: "Lemonade 1L", weight: "1л", description: "Лимонада / Homemade lemonade", priceBgn: "13.99", priceEur: "7.16", isAvailable: true, sortOrder: 3 },
    ]);

    // === HOT DRINKS (IMG_0123) ===
    await db.insert(products).values([
      { categoryId: catHotDrinks, name: "Turkish Coffee", nameEn: "Turkish Coffee", weight: "40мл", description: "Турско кафе / Traditional Turkish coffee", priceBgn: "3.99", priceEur: "2.04", isAvailable: true, sortOrder: 1 },
      { categoryId: catHotDrinks, name: "Turkish Tea", nameEn: "Turkish Tea", weight: "150мл", description: "Турски чай / Traditional Turkish tea", priceBgn: "2.99", priceEur: "1.53", isAvailable: true, sortOrder: 2 },
      { categoryId: catHotDrinks, name: "Espresso", nameEn: "Espresso", weight: "40мл", description: "Еспресо / Italian espresso", priceBgn: "3.99", priceEur: "2.04", isAvailable: true, sortOrder: 3 },
      { categoryId: catHotDrinks, name: "Espresso Decaf", nameEn: "Espresso Decaf", weight: "40мл", description: "Еспресо без кофеин / Decaffeinated espresso", priceBgn: "3.99", priceEur: "2.04", isAvailable: true, sortOrder: 4 },
      { categoryId: catHotDrinks, name: "Cappuccino", nameEn: "Cappuccino", weight: "250мл", description: "Капучино / Italian cappuccino", priceBgn: "4.99", priceEur: "2.55", isAvailable: true, sortOrder: 5 },
      { categoryId: catHotDrinks, name: "Milk with Nescafe", nameEn: "Milk with Nescafe", weight: "250мл", description: "Мляко с Нескафе / Milk with instant coffee", priceBgn: "4.99", priceEur: "2.55", isAvailable: true, sortOrder: 6 },
      { categoryId: catHotDrinks, name: "Milk", nameEn: "Milk", weight: "50мл", description: "Каничка мляко / Milk", priceBgn: "1.00", priceEur: "0.51", isAvailable: true, sortOrder: 7 },
      { categoryId: catHotDrinks, name: "Te Tea", nameEn: "Te Tea", weight: "400мл", description: "Чай 'Те' / Specialty tea", priceBgn: "6.99", priceEur: "3.57", isAvailable: true, sortOrder: 8 },
    ]);

    // === SEED TABLES ===
    await db.insert(tables).values([
      { name: "Маса 1", qrToken: "table-1-demo-001", visitCount: 0, totalRevenue: "0.00", isActive: true },
      { name: "Маса 2", qrToken: "table-2-demo-002", visitCount: 0, totalRevenue: "0.00", isActive: true },
      { name: "Маса 3", qrToken: "table-3-demo-003", visitCount: 0, totalRevenue: "0.00", isActive: true },
      { name: "Маса 4", qrToken: "table-4-demo-004", visitCount: 0, totalRevenue: "0.00", isActive: true },
      { name: "Маса 5", qrToken: "table-5-demo-005", visitCount: 0, totalRevenue: "0.00", isActive: true },
      { name: "Маса 6", qrToken: "table-6-demo-006", visitCount: 0, totalRevenue: "0.00", isActive: true },
      { name: "Градина 1", qrToken: "table-g1-demo-007", visitCount: 0, totalRevenue: "0.00", isActive: true },
      { name: "Градина 2", qrToken: "table-g2-demo-008", visitCount: 0, totalRevenue: "0.00", isActive: true },
      { name: "Градина 3", qrToken: "table-g3-demo-009", visitCount: 0, totalRevenue: "0.00", isActive: true },
      { name: "Бар", qrToken: "table-bar-demo-010", visitCount: 0, totalRevenue: "0.00", isActive: true },
    ]);

    return { message: "Seeded successfully with complete menu (190+ items)" };
  }),
});
