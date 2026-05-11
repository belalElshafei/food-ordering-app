export type Category = 'burgers' | 'pizza' | 'drinks' | 'desserts';

export interface MenuItem {
  id: string;
  category: Category;
  image: string;
  price: number;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
}

export const menuItems: MenuItem[] = [
  // Burgers
  {
    id: 'b1',
    category: 'burgers',
    image: '/images/burger.png',
    price: 45,
    name: { en: 'The Royal Classic', ar: 'رويال كلاسيك' },
    description: { en: 'Aged wagyu beef, melted gold cheddar, and signature truffle aioli.', ar: 'لحم واجيو معتق، جبن شيدر ذهبي ذائب، وصلصة كمأ فاخرة.' }
  },
  {
    id: 'b2',
    category: 'burgers',
    image: '/images/burger.png',
    price: 52,
    name: { en: 'Smokey Inferno', ar: 'سموكي إنفيرنو' },
    description: { en: 'Double beef patty, smoked bacon, jalapeños, and spicy chipotle.', ar: 'شريحتان من اللحم، لحم بقري مدخن، هلابينو، وصلصة شيبوتلي حارة.' }
  },
  {
    id: 'b3',
    category: 'burgers',
    image: '/images/burger.png',
    price: 65,
    name: { en: 'Truffle Prestige', ar: 'ترافل برستيج' },
    description: { en: 'Prime beef, wild mushrooms, and black truffle shavings.', ar: 'لحم فاخر، فطر بري، ورقائق الكمأ الأسود.' }
  },
  // Pizza
  {
    id: 'p1',
    category: 'pizza',
    image: '/images/pizza.png',
    price: 55,
    name: { en: 'La Margherita Dorata', ar: 'مارجريتا الذهبية' },
    description: { en: 'San Marzano tomatoes, buffalo mozzarella, and fresh basil.', ar: 'طماطم سان مارزانو، موزاريلا بوفالو، وريحان طازج.' }
  },
  {
    id: 'p2',
    category: 'pizza',
    image: '/images/pizza.png',
    price: 60,
    name: { en: 'Quattro Formaggi', ar: 'كواترو فورماجي' },
    description: { en: 'Blend of four premium Italian cheeses and walnuts.', ar: 'مزيج من أربعة أنواع أجبان إيطالية فاخرة مع الجوز.' }
  },
  {
    id: 'p3',
    category: 'pizza',
    image: '/images/pizza.png',
    price: 68,
    name: { en: 'Diavola Suprema', ar: 'ديافولا سوبريما' },
    description: { en: 'Spicy salami, red chili, and honey drizzle.', ar: 'سلامي حار، فلفل أحمر، ولمسة من العسل.' }
  },
  // Drinks
  {
    id: 'd1',
    category: 'drinks',
    image: '/images/drink.png',
    price: 25,
    name: { en: 'Royal Lemon Mint', ar: 'ليمون بالنعناع الملكي' },
    description: { en: 'Freshly squeezed lemons with garden mint and crushed ice.', ar: 'ليمون طازج مع نعناع بري وثلج مجروش.' }
  },
  {
    id: 'd2',
    category: 'drinks',
    image: '/images/drink.png',
    price: 30,
    name: { en: 'Mango Saffron Lassi', ar: 'لاسي المانجو والزعفران' },
    description: { en: 'Creamy mango yogurt blended with premium Persian saffron.', ar: 'زبادي المانجو الكريمي ممزوج مع الزعفران الفارسي الفاخر.' }
  },
  {
    id: 'd3',
    category: 'drinks',
    image: '/images/drink.png',
    price: 22,
    name: { en: 'Dark Cold Brew', ar: 'كولد برو داكن' },
    description: { en: '18-hour cold steeped Arabica coffee.', ar: 'قهوة أرابيكا مستخلصة ببطء لمدة ١٨ ساعة.' }
  },
  // Desserts
  {
    id: 's1',
    category: 'desserts',
    image: '/images/dessert.png',
    price: 35,
    name: { en: 'Lava Noir', ar: 'لافا نوار' },
    description: { en: 'Belgian dark chocolate fondant with a molten core.', ar: 'فوندان الشوكولاتة البلجيكية الداكنة مع قلب ذائب.' }
  },
  {
    id: 's2',
    category: 'desserts',
    image: '/images/dessert.png',
    price: 40,
    name: { en: 'Saffron Kunafa', ar: 'كنافة بالزعفران' },
    description: { en: 'Traditional kunafa with a saffron-infused cream.', ar: 'كنافة تقليدية مع كريمة غنية بالزعفران.' }
  },
  {
    id: 's3',
    category: 'desserts',
    image: '/images/dessert.png',
    price: 38,
    name: { en: 'Cardamom Crème Brûlée', ar: 'كريم بروليه بالهيل' },
    description: { en: 'Rich custard flavored with cardamom and caramelized sugar.', ar: 'كاسترد غني بنكهة الهيل مع سكر مكرمل.' }
  },
];
