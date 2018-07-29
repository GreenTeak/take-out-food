'use strict'
const loadAllItems = require('../src/items.js')
const loadPromotions = require('../src/promotions.js')
function bestCharge(selectedItems) {
  let orderForm = `============= 订餐明细 =============\n`;
  const allItem = loadAllItems();
  const promotions = loadPromotions();
  let totalCount = 0;
  let firstDiscount = 6;
  let secondDiscount = 0;
  let secondDiscountName = [];

  //将输入中每个item的barcode和value提出来
  const itemAndNum = selectedItems.map((item) => {
    let itemValue = item.split(' x ');
    return {key: itemValue[0], value: itemValue[1]}
  })

  //计算每项的价位
  for (let i = 0; i < itemAndNum.length; i++) {
    let priceNoCount = allItem.filter((item) => item.id === itemAndNum[i].key)
    let itemCount = priceNoCount[0].price * itemAndNum[i].value;
    let itemStr = `${priceNoCount[0].name} x ${itemAndNum[i].value} = ${itemCount}元\n`
    orderForm += itemStr;
    totalCount += itemCount;
    if(promotions[1].items.includes(itemAndNum[i].key)){
      secondDiscount += itemCount/2;
      secondDiscountName.push(priceNoCount[0].name);
    }
  }

  //不使用优惠
  orderForm += `-----------------------------------\n`;
  if(secondDiscount == 0 &&totalCount < 30){
    orderForm += `总计：${totalCount}元\n===================================`
    return orderForm;
  }

  //使用哪种优惠
  let haveDiscount = `使用优惠:\n`;
  if(secondDiscount > firstDiscount){
     //haveDiscount += promotions[1].type + "("+secondDiscountName.join("，")+`)，\n`;
     haveDiscount +=`${promotions[1].type}(${secondDiscountName.join("，")})，省${secondDiscount}元\n`
     totalCount -= secondDiscount;
  }
  if(secondDiscount <= firstDiscount && totalCount >= 30){
    haveDiscount += promotions[0].type + `，省6元\n`;
    totalCount -= firstDiscount;
  }

  //计算总的orderForm
  orderForm += haveDiscount + `-----------------------------------\n`;
  orderForm += `总计：${totalCount}元\n===================================`
  return orderForm;
}
module.exports = bestCharge

