export interface FoodItem {
  id: string;
  name: string;
  price: number;
  weight?: string;
  image?: string;
}

export interface FoodCategory {
  id: string;
  title: string;
  icon: string;
  items: FoodItem[];
}

export const FOOD_MENU: FoodCategory[] = [
  {
    id: "kids",
    title: "Детское меню",
    icon: "🍟",
    items: [
      { id: "k_nuggets", name: "Куриные наггетсы с картошкой фри", price: 540, weight: "255г" },
      { id: "k_kitty", name: "Овощной котенок", price: 430, weight: "190г" },
      { id: "k_bear", name: "Фруктовый медвежонок", price: 760, weight: "420г" },
      { id: "k_bunny", name: "Фруктовый зайчик", price: 530, weight: "350г" },
      { id: "k_soup", name: "Супчик с картофелем и фрикадельками", price: 420, weight: "350г" },
      { id: "k_pasta", name: "Домашние спагетти с фрикадельками", price: 540, weight: "260г" },
      { id: "k_burger", name: "Мини-бургер с говядиной и фри", price: 740, weight: "365г" },
      { id: "k_octopus", name: "Сосиски-осьминожки с пюре", price: 640, weight: "380г" },
      { id: "k_macaroni", name: "Цветные макарошки с сыром", price: 480, weight: "145г" },
    ]
  },
  {
    id: "pizza",
    title: "Пицца",
    icon: "🍕",
    items: [
      { id: "p_margh", name: "Маргарита", price: 650, weight: "480г" },
      { id: "p_pepp", name: "Пепперони", price: 820, weight: "535г" },
      { id: "p_4cheese_tom", name: "Четыре сыра с томатным соусом", price: 830, weight: "550г" },
      { id: "p_4cheese_cream", name: "Четыре сыра со сливочным соусом и трюфельным маслом", price: 890, weight: "515г" },
      { id: "p_parma", name: "С пармской ветчиной и страчателлой", price: 1130, weight: "540г" },
      { id: "p_salmon", name: "Сальмоне", price: 1290, weight: "540г" },
      { id: "p_pear", name: "С грушей и горгонзолой", price: 970, weight: "665г" },
      { id: "p_bambini", name: "Бамбини", price: 750, weight: "480г" },
      { id: "p_village", name: "Деревенская", price: 960, weight: "705г" },
    ]
  },
  {
    id: "company",
    title: "На компанию",
    icon: "🍱",
    items: [
      { id: "c_bruschetta", name: "Ассорти брускетт", price: 1500, weight: "355г" },
      { id: "c_meat", name: "Мясное плато", price: 3800, weight: "965г" },
      { id: "c_cheese", name: "Сырная тарелка", price: 1190, weight: "265г" },
      { id: "c_hot_snacks", name: "Ассорти горячих закусок", price: 1690, weight: "795г" },
      { id: "c_deli", name: "Ассорти мясных деликатесов", price: 1590, weight: "290г" },
      { id: "c_veg", name: "Овощной сет", price: 990, weight: "540г" },
      { id: "c_dips", name: "Сет намазок", price: 1200, weight: "440г" },
    ]
  },
  {
    id: "drinks",
    title: "Напитки",
    icon: "🍹",
    items: [
      { id: "d_mors_1l", name: "Морс Вишневый / Клюквенный", price: 600, weight: "1л" },
      { id: "d_lemonade_1l", name: "Лимонад Классический / Мохито", price: 550, weight: "1л" },
      { id: "d_juice_1l", name: "Сок (Яблочный / Апельсиновый)", price: 620, weight: "1л" },
      { id: "d_aqua_2l", name: "Аква минерали", price: 390, weight: "2л" },
      { id: "d_shake", name: "Молочный коктейль", price: 420, weight: "400мл" },
      { id: "d_crazy_shake", name: "Крези Шейк", price: 560, weight: "400мл" },
      { id: "d_tea", name: "Чай (Ассам / Эрл Грей / Сенча)", price: 450, weight: "600мл" },
    ]
  },
  // {
  //   id: "desserts",
  //   title: "Десерты",
  //   icon: "🧁",
  //   items: [
  //     { id: "ds_potato", name: "Пирожное-эскимо «Картошка»", price: 190, weight: "80г" },
  //     { id: "ds_brownie", name: "Пирожное «Брауни с соленой карамелью»", price: 290, weight: "80г" },
  //     { id: "ds_panna", name: "Панна котта малиновая", price: 290, weight: "110г" },
  //     { id: "ds_tart", name: "Тарталетка «Лимон-Лайм»", price: 350, weight: "100г" },
  //     { id: "ds_icecream", name: "Мороженое (Ванильное / Шоколадное)", price: 150, weight: "50г" },
  //   ]
  // }
];
