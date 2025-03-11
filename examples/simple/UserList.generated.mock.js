const { faker } = require('@faker-js/faker/locale/zh_CN');

function generateUser() {
    return {
        id: faker.number.int(),
        name: faker.person.fullName(),
        status: faker.helpers.arrayElement(['active', 'inactive'])
    };
}

function generateUserList() {
    const users = faker.helpers.multiple(generateUser, { count: 5 });
    return { users };
}

console.log(JSON.stringify(generateUserList(), null, 4));

module.exports = generateUserList;