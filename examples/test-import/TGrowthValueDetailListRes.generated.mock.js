const { faker } = require('@faker-js/faker/locale/zh_CN');

function generateTGrowthValue() {
    return {
        type: faker.number.int({ min: 1, max: 10 }),
        typeDec: faker.lorem.word(),
        dateStr: faker.date.past().toISOString().split('T')[0],
        value: faker.number.int({ min: 100, max: 1000 }).toString()
    };
}

function generateTGrowthValueDetailListRes() {
    const growthValueList = Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, () => generateTGrowthValue());
    return {
        totalCount: faker.number.int({ min: 1, max: 100 }).toString(),
        growthValueList
    };
}

console.log(JSON.stringify(generateTGrowthValueDetailListRes(), null, 4));

module.exports = generateTGrowthValueDetailListRes;