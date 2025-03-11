const { faker } = require('@faker-js/faker/locale/zh_CN');

function generateIntegralValue() {
    return {
        type: faker.number.int({ min: 1, max: 10 }),
        typeDec: faker.lorem.word(),
        dateStr: faker.date.recent().toISOString().split('T')[0],
        value: faker.number.int({ min: 100, max: 1000 }).toString(),
        valueDesc: faker.lorem.sentence(),
        integralType: faker.number.int({ min: 1, max: 5 })
    };
}

function generateIntegralDetailListRes() {
    return {
        totalCount: faker.number.int({ min: 10, max: 100 }).toString(),
        integralValueList: Array.from({ length: faker.number.int({ min: 5, max: 10 }) }, generateIntegralValue)
    };
}

console.log(JSON.stringify(generateIntegralDetailListRes(), null, 4));

module.exports = generateIntegralDetailListRes;