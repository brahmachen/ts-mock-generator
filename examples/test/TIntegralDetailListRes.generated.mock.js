const { faker } = require("@faker-js/faker/locale/zh_CN");

function generateTIntegralValue() {
  return {
    type: faker.number.int(),
    typeDec: faker.lorem.word(),
    dateStr: faker.date.past().toISOString().split("T")[0],
    value: faker.number.int().toString(),
    valueDesc: faker.lorem.sentence(),
    integralType: faker.number.int(),
    name: faker.person.fullName(),
  };
}

function generateTIntegralDetailListRes() {
  return {
    totalCount: faker.number.int().toString(),
    integralValueList: Array.from(
      { length: faker.number.int({ min: 1, max: 10 }) },
      generateTIntegralValue
    ),
  };
}

console.log(JSON.stringify(generateTIntegralDetailListRes(), null, 2));

module.exports = {
  generateTIntegralDetailListRes,
};
