const { faker } = require('@faker-js/faker/locale/zh_CN');

function generateIntegralDetailContent() {
  return {
    exchangeMemberLevels: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.number.int({ min: 1, max: 10 })),
    level: faker.number.int({ min: 1, max: 10 }),
    rules: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      title: faker.lorem.sentence(),
      desc: faker.lorem.paragraph(),
    })),
    exchangeFlag: faker.number.int({ min: 0, max: 1 }),
    btnName: faker.lorem.words(),
    exchangeId: faker.string.uuid(),
    name: faker.lorem.words(),
    spendIntegral: faker.number.int({ min: 100, max: 1000 }),
    remain: faker.number.int({ min: 0, max: 100 }),
    remark: faker.lorem.sentence(),
    ticketValue: faker.finance.amount(),
    detailImage: faker.image.url(),
  };
}

console.log(JSON.stringify(generateIntegralDetailContent(), null, 4));

module.exports = generateIntegralDetailContent;