const { faker } = require('@faker-js/faker/locale/zh_CN');

function generateTGradeRight() {
  return {
    gradeRightName: faker.commerce.productName(),
    gradeRightDecs: faker.lorem.sentence(),
    gradeRightIcon: faker.image.url(),
    gradeRightTitle: faker.commerce.productAdjective(),
    gradeRightExplain: faker.lorem.paragraph()
  };
}

function generateTGradeRes() {
  const memberGrade = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
    thresholdValue: faker.number.float({ min: 100, max: 1000 }),
    gradeIcon: faker.image.url(),
    gradeCode: faker.number.int({ min: 1, max: 10 }),
    gradeName: faker.commerce.department(),
    gradeRightDecs: faker.lorem.sentence(),
    upgradePrompt: faker.lorem.sentence(),
    gradeRightAcount: faker.number.int({ min: 1, max: 10 }),
    gradeRightList: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, generateTGradeRight)
  }));

  return {
    memberGrade,
    validitypPeriod: faker.date.future().toISOString(),
    growthValue: faker.number.float({ min: 0, max: 1000 }),
    topTipDesc: faker.lorem.sentence()
  };
}

module.exports = generateTGradeRes;