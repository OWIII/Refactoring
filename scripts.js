let score = document.querySelector('.score');

// Загружаем json

function loadJson() {
  fetch('invoices.json')
    .then(response => response.json())
    .then(answer => {
      const invoice = answer[0];
      console.log(answer[0]);
      score.textContent = statement(invoice); // Выводим на страницу, чтобы видеть результат
    });
};

loadJson();

// Основная функция

function statement(invoice) {
  return renderText(invoice);
};

// Функция вывода текста на экран

function renderText(invoice) {
  let result = `Счет для ${invoice.customer}\n`;

  invoice.performance.forEach(function(elem) {
    result += `${elem.playId}: ${format(switchOfPlays(elem) / 100)}\n(${elem.audience} мест)\n`;
  });
  return result += `Итого с вас ${format(totalAmount(invoice)/100)}\nВы заработали ${finalVolumeCredits(invoice)} бонусов`;
};

// Извлекаем часть кода в отдельную функцию с выбором типа пьессы и заменяем switch на объект

function switchOfPlays(perf) {
  let result = 0;

  let plays = {
    'tragedy' : function() {
      result = 40000;
      return perf.audience > 30 ? result += 1000 * (perf.audience - 30) : result;
    },
    'comedy' : function() {
      result = 30000;
      perf.audience > 20 ? result += 10000 + 500 * (perf.audience - 20) : result;
      result += 300 * perf.audience;
      return result;
    },
    'default' : function() {
      throw new Error(`неизвестный тип: ${perf.type}`);
    }
  };
  return (plays[perf.type] || plays['default'])();
};

// Извлекаем код с бонусами в отдельную функцию

function volumeCreditsForPerson(perf) {
  let result = 0;

  result += Math.max(perf.audience - 30, 0);
  "comedy" === perf.type ? result += Math.floor(perf.audience / 5) : result;
  return result;
};

// Извлекаем формат в отдельную функцию

function format(num) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 2
  }).format(num);
};

// Функция подсчета итоговых бонусов

function finalVolumeCredits(invoice) {
  let result = 0;

  invoice.performance.forEach(elem => result += volumeCreditsForPerson(elem));
  return result;
};

// Функция подсчета итогового счета

function totalAmount(invoice) {
  let result = 0;

  invoice.performance.forEach(elem => result += switchOfPlays(elem));
  return result;
};

