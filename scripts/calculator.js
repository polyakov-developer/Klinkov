const priceList = {
  material: [{
      id: 1,
      name: "Синтетика, полушерсть, шерсть",
      price: 180
    },
    {
      id: 2,
      name: "Вискоза, сизаль, хлопок, шёлк (фабричные ковры)",
      price: 400
    },
    {
      id: 3,
      name: "Шерсть, шерсть+шёлк (ковры ручной работы)",
      price: 600
    },
    {
      id: 4,
      name: "Шёлк (ковры ручной работы)",
      price: 1000
    }
  ]
}

const saleList = [{
    id: 1,
    value: 10,
    summable: [5]
  },
  {
    id: 2,
    value: 10,
    summable: [5]
  },
  {
    id: 3,
    value: 15
  },
  {
    id: 4,
    value: 20
  },
  {
    id: 5,
    value: 5,
    summable: [1, 2]
  }
]

/**
 * Обновить итоговую сумму в калькуляторе
 * @param {Number} totalCost // стоимость химчистки
 * @param {Number} discount // размер скидки в %
 */
const updateTotalCost = function (totalCost, discount) {
  if (discount > 0) {
    let totalCostDiscount = totalCost - (totalCost / 100 * discount);
    document.querySelector(".total-cost .old").classList.remove("d-none");
    document.querySelector(".total-cost .old .value").innerHTML = totalCost;
    document.querySelector(".total-cost .current .value").innerHTML = totalCostDiscount;
    document.getElementById("total-cost-discount").value = totalCostDiscount;
    document.getElementById("total-cost-original").value = totalCost;
  } else {
    document.querySelector(".total-cost .old").classList.add("d-none");
    document.querySelector(".total-cost .old .value").innerHTML = "0";
    document.querySelector(".total-cost .current .value").innerHTML = totalCost;
    document.getElementById("total-cost-original").value = totalCost;
  }
}

/**
 * Расчитать стоимость чистки выбранного материала
 * @param {Number} area // Площадь
 * @param {Number} price // Стоимость материала 
 */
const calculateTotalCost = function (area, price) {
  return Math.ceil(area * price);
}

/**
 * Расчитать площадь по форме ковра
 * @param {String} shape // форма ковра
 * @param {Number} l // длина
 * @param {Number} w // ширина
 * @param {Number} d // диаметр
 */
const calculateAreaCarpetShape = function (shape, l, w, d) {
  switch (shape) {
    case "1":
      return l * w;
      break;
    case "2":
      return (l * w) - Math.ceil(l * w) * 0.1;
      break;
    case "3":
      return (d * d) - Math.ceil(d * d) * 0.2;
      break;
    default:
      return l * w;
  }
}

/**
 * Получить стоимость за выбранный материал из прайс листа
 * @param {Number} material 
 * @param {Boolean} increase 
 */
const getPriceOfMaterial = function (material, increase) {
  if (material !== null) {
    let key = priceList["material"].findIndex((elem, index) => elem["id"] === parseInt(material.value));
    let price = priceList["material"][key]["price"] !== undefined ? priceList["material"][key]["price"] : 0;

    if (increase === true) {
      price += 40;
    }

    return price;
  } else {
    return 0;
  }
}

/**
 * Получить размер скидки из списка
 * @param {Number} discount
 */
const getDiscount = function (discount) {
  if (discount !== null) {
    let totalDiscount = 0;

    discount.forEach(element => {
      if (element.checked === true) {
        let key = saleList.findIndex((elem, index) => elem["id"] === parseInt(element.value));
        totalDiscount += saleList[key]["value"] !== undefined ? saleList[key]["value"] : 0;
      }
    });

    return totalDiscount;
  } else {
    return 0;
  }
}

const calculate = function () {
  let shape = document.querySelector("input[name='f_CarpetShape[]']:checked") || 0, // Форма ковра
    length = document.getElementById("length"), // Длина
    width = document.getElementById("width"), // Ширина
    diameter = document.getElementById("diameter"), // Диаметр
    increase = document.getElementById("long-nap").checked, // Доп. за длинный ворс
    materialList = document.querySelectorAll("input[name='f_CarpetMaterial[]']"), // Список материалов со страницы 
    material = document.querySelector("input[name='f_CarpetMaterial[]']:checked") || null, // Материал
    materialPrice = 0, // Стоимость чистки кв.м. для выбранного материала
    discount = document.querySelectorAll("input[name='f_Sale[]']"), // Скидка
    followerDiscount = document.querySelector("input[name='f_isBandMember']:checked"), // Доп. скидка
    totalCostElement = document.getElementById("total-cost-original"),
    totalCostDiscountElement = document.getElementById("total-cost-discount"),
    totalCost = parseInt(totalCostElement.value) == NaN ? 0 : parseInt(totalCostElement.value), // Полная стоимость
    totalCostDiscount = parseInt(totalCostDiscountElement.value) == NaN ? 0 : parseInt(totalCostDiscountElement.value), // Стоимость со скидкой
    area = 0; // Площадь

  length.value = length.value < 0 ? 0 : length.value;
  length.value = length.value > 99 ? 99 : length.value;

  width.value = width.value < 0 ? 0 : width.value;
  width.value = width.value > 99 ? 99 : width.value;

  diameter.value = diameter.value < 0 ? 0 : diameter.value;
  diameter.value = diameter.value > 99 ? 99 : diameter.value;

  // Площадь ковра
  area = calculateAreaCarpetShape(shape.value, length.value, width.value, diameter.value);

  // Материал ковра
  if (material !== null) {
    totalCost = calculateTotalCost(area, getPriceOfMaterial(material, false));
  }

  // Длинный ворс
  if (increase === true) {
    materialList.forEach(element => {
      element.disabled = true;
      element.checked = false;
    });

    materialList[0].disabled = false;
    materialList[0].checked = true;

    totalCost = calculateTotalCost(area, getPriceOfMaterial(materialList[0], true));
  } else {
    [] = Array.from(materialList).map((el) => el.disabled = false);
    totalCost = calculateTotalCost(area, getPriceOfMaterial(material, false));
  }

  // Скидка
  if (discount !== null) {
    discount = getDiscount(discount);
  }

  // Обновить итоговую стоимость в калькуляторе
  updateTotalCost(totalCost, discount);
}

const changeCarpetShape = function (e) {
  let currentElem = e.target,
    shape = currentElem.value;

  switch (shape) {
    case "1":
    case "2":
      document.getElementById("length").disabled = false;
      document.getElementById("width").disabled = false;
      document.getElementById("diameter").value = "";
      document.getElementById("diameter").disabled = true;
      break;
    case "3":
      document.getElementById("length").value = "";
      document.getElementById("width").value = "";
      document.getElementById("length").disabled = true;
      document.getElementById("width").disabled = true;
      document.getElementById("diameter").disabled = false;
      break;
    default:
      document.getElementById("length").disabled = false;
      document.getElementById("width").disabled = false;
      document.getElementById("diameter").value = "";
      document.getElementById("diameter").disabled = true;
  }
}

const changeDiscount = function (e) {
  // Текущий элемент (скидка)
  const currentElem = e.target;

  // Массив всех скидок
  let discountList = document.querySelectorAll("input[name='f_Sale[]']");

  if (Array.from(discountList).every(el => el.checked == false)) {
    // Не выбрана ни одна скидка
    // Разблокировать все скидки
    discountList = Array.from(discountList).map((el, i, arr) => arr[i].disabled = false);
  } else {
    // Есть выбранные скидки
    // Возьмем только первую из массива
    let selectedDiscount = Array.from(discountList).filter(el => el.checked == true);

    // индекс скидки из массива
    let key = saleList.findIndex(el => el["id"] === parseInt(selectedDiscount[0].value));
    // суммирующиеся скидки для выбранной
    let summable = saleList[key]["summable"] !== undefined ? saleList[key]["summable"] : null;

    // Если у скидки есть суммирующиеся
    if (summable !== null) {
      [] = Array.from(discountList).map((el, i, arr) => {
        if (summable.includes(parseInt(arr[i].value)) == false && arr[i] !== currentElem && arr[i] !== selectedDiscount[0]) {
          // Блокируем скидки, которые нельзя суммировать с текущей
          arr[i].disabled = true;
        } else {
          // Получаем массив доступных скидок
          arr = arr.filter(el => summable.includes(parseInt(el.value)));
          // Разблокируем доступные скидки
          arr = arr.map(el => el.disabled = false);
        }
      });
    } else {
      // У скидки нет суммирующихся, блокируем все и оставляем активной текущую
      [] = Array.from(discountList).map(el => el.disabled = true);
      currentElem.disabled = false;
    }
  }

  calculate();
}

const getFieldsOfCalc = function () {
  let calculator = document.getElementById("calculator"),
    arrFields = calculator.querySelectorAll("input"),
    myResult = [];

  myResult = [].filter.call(arrFields, function (obj) {
    if (obj.checked === true) {
      return obj;
    } else if ((obj.type == "number" || obj.type == "hidden") && obj.value !== "") {
      return obj;
    }
  });

  myResult = myResult.map(input => {
    return {
      name: input.name,
      value: input.value,
      type: input.type
    }
  });

  document.querySelector("#calcModal .hidden-fields").innerHTML = "";

  myResult.forEach(input => {
    let elem = document.createElement("input");

    elem.type = "hidden";

    if (input.type != "checkbox") {
      elem.name = input.name.replace(/\[|\]/g, '');
    } else {
      elem.name = input.name;
    }

    elem.value = input.value;

    document.querySelector("#calcModal .hidden-fields").append(elem);
  });

  $("#calcModal").modal();
}