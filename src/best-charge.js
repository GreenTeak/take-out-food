require('items.js')
require('promotions.js')
function bestCharge(selectedItems) {
  let orderForm = `============= 订餐明细 =============\n`;
  const allItem = loadAllItems();
  const promotions = loadPromotions();
  let totalCount = 0;
  let firstDiscount = 6;
  let secondDiscount = 0;
  let secondDiscountName = [];
  const itemAndNum = selectedItems.map((item) => {
    let itemValue = item.split(' x ');
    return {key: itemValue[0], value: itemValue[1]}
  })
  for (let i = 0; i < itemAndNum.length; i++) {
    let priceNoCount = allItem.filter((item) => item.id === itemAndNum[i].key)
    let itemCount = priceNoCount[0].name * itemAndNum[i].value;
    let itemStr = `${priceNoCount[0].name} x ${itemAndNum[i].value} = ${itemCount}元\n`
    orderForm += itemStr;
    totalCount += itemCount;
    if(promotions[1].items.includes(itemAndNum[i].key)){
      secondDiscount += itemCount/2;
      secondDiscountName.push(priceNoCount[0].name);
    }
  }
  orderForm += `-----------------------------------\n`;
  let haveDiscount = `使用优惠:\n`;
  if(secondDiscount > firstDiscount){
     haveDiscount += promotions[1].type + "，"+secondDiscountName.join("，")+`\n`;
     totalCount -= secondDiscount;
  }
  if(secondDiscountName <= firstDiscount && totalCount >= 30){
    haveDiscount += promotions[0].type + `，省6元\n`;
    totalCount -= firstDiscount;
  }
  orderForm += haveDiscount;
  if(secondDiscount == 0 &&totalCount < 30){
    orderForm += `总计：${totalCount}元\n===================================`
  }
  return orderForm;
}

