const { faker } = require('@faker-js/faker/locale/zh_CN');

function generateCityLocationResType() {
    return {
        defaultFlag: faker.number.int({ min: 0, max: 1 }),
        gdCityName: faker.location.city(),
        msg: faker.lorem.sentence(),
        status: faker.number.int({ min: 0, max: 1 }),
        doorServiceTime: faker.date.future().toISOString(),
        cityLon: faker.location.longitude().toString(),
        cityLat: faker.location.latitude().toString(),
        testDriverFlag: faker.datatype.boolean(),
        doorFlag: faker.datatype.boolean(),
        cityName: faker.location.city(),
        cityId: faker.string.uuid()
    };
}

console.log(JSON.stringify(generateCityLocationResType(), null, 4));

module.exports = generateCityLocationResType;