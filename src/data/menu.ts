export type MenuItem = { id: string; name: string; category: string; price: number; description: string; combo?: boolean; image?: string; special?: boolean; alcohol?: boolean }
// Prices in USD cents, transcribed from the four menu images supplied by the owner.
export const MENU: MenuItem[] = [
  {id:'solo-queso',name:'Solo Queso?',category:'Hamburguesas',price:350,description:'Pan de papa, 100 g de carne smash, cheddar, pickles y el toque de la casa.',combo:true,image:'burgers'},
  {id:'ajitate-burger',name:'Ajitate Burger',category:'Hamburguesas',price:399,description:'Pan de papa, 120 g de carne smash, mozzarella, guacamole y crema de frijol.',combo:true,image:'burgers'},
  {id:'bacon-smash',name:'Bacon Smash',category:'Hamburguesas',price:499,description:'Pan brioche, 120 g de carne smash, cheddar, mermelada de cebolla BBQ, tocino y el toque de la casa.',combo:true,image:'burgers'},
  {id:'black-tate',name:'Black Tate',category:'Hamburguesas',price:625,description:'Pan negro, 200 g de carne smash, cheddar, salsa cheddar spicy (poco picante) y el toque de la casa.',combo:true,image:'burgers'},
  {id:'birria-burger',name:'Birria Burger',category:'Hamburguesas',price:650,description:'Pan brioche, 100 g de carne smash, birria desmenuzada, guacamole, crema de frejol, 2 quesos y el toque de la casa.',combo:true,image:'burgers'},
  {id:'smash-berries',name:'Smash Berries',category:'Hamburguesas',price:650,description:'Pan pretzel, 200 g de carne smash, mantequilla de maní, mermelada de frutos rojos, mozzarella y tocino.',combo:true,image:'burgers'},
  {id:'pork-bbq',name:'Burger Pork BBQ',category:'Hamburguesas',price:625,description:'Pan pretzel, 100 g de carne smash, pulled pork, mozzarella, cheddar, pickles y el toque de la casa.',combo:true,image:'burgers'},
  {id:'yummy-jam',name:'Yummy! Jam',category:'Edición especial',price:799,description:'Pan brioche, media libra de carne, toque ahumado, mozzarella, mascarpone, jalea y gajos de durazno, tocino crocante y salsa de la casa.',combo:true,image:'burgers',special:true},
  {id:'chistorra',name:'Chistorra Burger',category:'Edición especial',price:799,description:'Pan de papa, 120 g de carne, chistorra española (picante medio), mozzarella y chimichurri de la casa.',combo:true,image:'burgers',special:true},
  {id:'tacos-birria',name:'Tacos de Birria',category:'Tex-Mex',price:575,description:'3 tacos con base de queso derretido, carne de birria, guacamole y salsa de la casa según la opción.',combo:true,image:'texmex'},
  {id:'tacos-pork',name:'Tacos Pulled Pork',category:'Tex-Mex',price:525,description:'3 tacos con base de queso derretido, pulled pork, guacamole y salsa de la casa según la opción.',combo:true,image:'texmex'},
  {id:'tacos-pollo',name:'Tacos de Pollo',category:'Tex-Mex',price:525,description:'3 tacos con base de queso derretido, pollo, guacamole y salsa de la casa según la opción.',combo:true,image:'texmex'},
  {id:'burrito-especial',name:'Burrito Especial',category:'Tex-Mex',price:450,description:'Pollo, guacamole, salsa de la casa, crema de frijol y arroz, bañado en salsa de chilli con carne y yogurt de aguacate.',combo:true,image:'texmex'},
  {id:'birria-burrito',name:'Birria Burrito',category:'Tex-Mex',price:599,description:'Carne de birria, cebolla salteada, guacamole, crema de frejol y salsa de la casa, gratinado en mozzarella.',combo:true,image:'texmex'},
  {id:'burrito-supremo',name:'Burrito Supremo',category:'Tex-Mex',price:1290,description:'Burrito gigante con 3 carnes, guacamole, crema de frijol, salsa de la casa, chilli con carne, yogurt de aguacate y finas hierbas. Con nachos, papas y salsas.',combo:true,image:'texmex'},
  {id:'quesadilla-birria',name:'Quesadilla Birria',category:'Tex-Mex',price:550,description:'Carne de birria, cebolla salteada y mucho queso. Bañada en salsa cheddar y acompañada de caldo de birria.',combo:true,image:'texmex'},
  {id:'quesadilla-bbq',name:'Quesadilla BBQ',category:'Tex-Mex',price:550,description:'Pulled pork, BBQ de la casa, mayonesa y quesos, bañada en salsa cheddar y BBQ con finas hierbas.',combo:true,image:'texmex'},
  {id:'costillas-premium',name:'Costillas BBQ · Premium',category:'Especiales',price:999,description:'Costillas selladas en plancha con toque ahumado, papas clásicas, apio y zanahoria, lactonesa de cebollín y salsa BBQ AJITATE.',image:'specials',special:true},
  {id:'costillas-familiar',name:'Costillas BBQ · Familiar',category:'Especiales',price:1599,description:'Presentación familiar con papas clásicas, apio y zanahoria, lactonesa de cebollín y salsa BBQ AJITATE.',image:'specials',special:true},
  {id:'chilli-nachos',name:'Chilli Nachos',category:'Especiales',price:399,description:'Nachos crujientes bañados en chilli con carne, cheddar líquido y guacamole, con finas hierbas.',image:'specials',special:true},
  {id:'chilli-papas',name:'Chilli Papas',category:'Especiales',price:399,description:'Papas clásicas con chilli con cheddar, yogurt de aguacate, guacamole, carne y finas hierbas.',image:'specials',special:true},
  {id:'papas-clasicas',name:'Papas Clásicas',category:'Especiales',price:250,description:'Papas clásicas crujientes con cáscara.',image:'specials',special:true},
  {id:'papas-bbq',name:'Papas BBQ',category:'Especiales',price:499,description:'Papas crujientes, 140 g de pulled pork salteado en BBQ, quesos derretidos, salsa cheddar y cebollín chino.',image:'specials',special:true},
  {id:'snack-fries',name:'Snack Fries Cheese',category:'Especiales',price:399,description:'Papas extra crujientes de corte rústico, bañadas en salsa cheddar, queso derretido y salsa de la casa.',image:'specials',special:true},
  {id:'limococo',name:'Limococo',category:'Bebidas',price:225,description:'Limonada con coco.'},
  {id:'limorosa',name:'Limorosa',category:'Bebidas',price:199,description:'Limonada con fresa.'},
  {id:'limofresh',name:'Limofresh',category:'Bebidas',price:199,description:'Limonada de menta y hierbabuena.'},
  {id:'frozen-mocca',name:'Frozen Mocca',category:'Bebidas',price:275,description:'Mocachino granizado.'},
  {id:'berries-love',name:'Berries Love',category:'Bebidas',price:299,description:'Milkshake de frutos rojos.'},
  {id:'colas',name:'Colas',category:'Bebidas',price:100,description:'Marca y presentación a confirmar.'},
  {id:'fuze',name:'Fuze Tea',category:'Bebidas',price:100,description:'Presentación a confirmar.'},
  {id:'guitig',name:'Guitig',category:'Bebidas',price:150,description:'Presentación a confirmar.'},
  {id:'agua',name:'Botella de Agua',category:'Bebidas',price:100,description:'Presentación a confirmar.'},
  ...([['heineken','Heineken',225],['club','Club',225],['corona','Corona',250],['amstel','Amstel',275],['stella','Stella',325],['paramo','Páramo',325],['modelo','Modelo',325],['mr-mouch','Mr. Mouch',325]] as const).map(([id,name,price])=>({id,name,category:'Cervezas',price,description:id==='paramo'?'Negra o roja; indica tu preferencia en las notas.':id==='mr-mouch'?'Rubia, roja o negra; indica tu preferencia en las notas.':'Presentación a confirmar.',alcohol:true})),
  {id:'blue-soul',name:'Blue Soul',category:'Cocteles',price:375,description:'Blue curaçao, vodka, sabores cítricos y dulces en una base de granadina.',alcohol:true},
  {id:'coco-frost',name:'Coco Frost',category:'Cocteles',price:399,description:'Coco y limón, con coco tostado y vodka.',alcohol:true},
  {id:'mojito',name:'Mojito Ajitate',category:'Cocteles',price:425,description:'Mojito de babaco.',alcohol:true},
  {id:'pina-colada',name:'Piña Colada',category:'Cocteles',price:399,description:'Un clásico a nuestro estilo.',alcohol:true},
  {id:'mocca-love',name:'Mocca Love',category:'Cocteles',price:425,description:'Coctel a base de café y chocolate con ron.',alcohol:true},
  {id:'valentino',name:'Valentino',category:'Cocteles',price:450,description:'Jugo de arándano, vodka, hierbabuena y soda.',alcohol:true},
]
export const CATEGORIES = ['Hamburguesas','Tex-Mex','Bebidas','Cervezas','Cocteles']
export const money = (cents: number) => new Intl.NumberFormat('es-EC',{style:'currency',currency:'USD'}).format(cents / 100)
export type CartLine = { id: string; side: string; quantity: number }
export const unitPrice = (line: CartLine) => {
  const item = MENU.find(i=>i.id===line.id)
  if (!item) throw new Error('Producto no disponible')
  return item.price + (item.combo && line.side ? 199 : 0)
}
export const subtotal = (cart: CartLine[]) => cart.reduce((sum,line)=>sum+unitPrice(line)*line.quantity,0)
export const lineKey = (line: Pick<CartLine,'id'|'side'>) => `${line.id}:${line.side}`
