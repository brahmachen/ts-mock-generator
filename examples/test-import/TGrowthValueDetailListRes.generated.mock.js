const { faker } = require('@faker-js/faker/locale/zh_CN');

const fakerInstance = faker;
function generateGrowthValueDetailListRes() {
  // 初始化Faker

  // 生成成长值明细列表
  const growthValueList = Array.from({ length: fakerInstance.number.int({ min: 3, max: 10 }) }, () => {
    const type = fakerInstance.number.int({ min: 0, max: 2 });
    let typeDec;
    switch (type) {
      case 0:
        typeDec = '旧会员升级';
        break;
      case 1:
        typeDec = '订单新增';
        break;
      case 2:
        typeDec = '过期';
        break;
    }

    return {
      type,
      typeDec,
      dateStr: fakerInstance.date.recent({ days: 30 }).toISOString().split('T')[0],
      value: fakerInstance.number.int({ min: 10, max: 1000 }).toString()
    };
  });

  // 计算总成长值
  const totalCount = growthValueList.reduce((sum, item) => sum + parseInt(item.value), 0).toString();

  return {
    totalCount,
    growthValueList
  };
}

console.log(generateGrowthValueDetailListRes());

module.exports = generateGrowthValueDetailListRes;