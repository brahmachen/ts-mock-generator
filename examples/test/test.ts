// 会员权益首页
const MEMBER_GRADE_INFO = "/resource/carrctapi/account/membership/grade/v1";
// 成长值明细
const MEMEBER_GROWTH_LIST =
  "/resource/carrctapi/account/membership/growthValueDetailList/v1";

// 我的积分
const MEMBER_SHIP_INTEGRAL =
  "/resource/carrctapi/account/membership/integral/v1";

// 根据积分进行兑换
const MEMBER_SHIP_GET_INTEGRAL =
  "/action/carrctapi/account/membership/getIntegral/v1";

// 积分明细列表
const MEMBER_SHIP_INTEGRAL_DETAIL_LIST =
  "/resource/carrctapi/account/membership/integralDetailList/v1";

// 兑换的商品详情
const GET_PRODUCT_INFO =
  "/resource/carrctapi/account/membership/integralDetail/v1";

export type TGrowthValue = {
  type: number; // OLD(0, "旧会员升级"), ORDER(1, "订单新增"), INVALID(2, "过期");
  typeDec: string; // 变化的描述
  dateStr: string; // 时间描述（yyyy-MM-dd）
  value: string; // 变化值
};

type TGrowthValueDetailListRes = {
  totalCount: string; // 总成长值
  growthValueList: TGrowthValue[]; // 成长值明细列表
};

export type TGradeRight = {
  gradeRightName: string; // 权益名称
  gradeRightDecs: string; // 权益描述
  gradeRightIcon: string; // 权益图标
  gradeRightTitle: string; // 权益说明标题
  gradeRightExplain: string; // 权益说明
};

export type TGradeRes = {
  memberGrade: {
    // 级别列表
    thresholdValue: number; // 阈值
    gradeIcon: string; // 图标
    /** 级别code：BASECARDS(1,"白银"), SILVERCARD(2,"黄金"), GOLDCARD(3,"白金"), PLATINUMCARD(5,"钻石"), DIAMOND(6,"黑金"); */
    gradeCode: number; // 级别code：BASECARDS(1,"白银"), SILVERCARD(2,"黄金"), GOLDCARD(3,"白金"), PLATINUMCARD(5,"钻石"), DIAMOND(6,"黑金");
    gradeName: string; // 级别名称
    gradeRightDecs: string; // 级别权益描述
    upgradePrompt: string; // 升级提示
    gradeRightAcount: number; // 权益数
    gradeRightList: TGradeRight[]; // 权益列表;
  }[];
  validitypPeriod: string; // 有效期
  growthValue: number; // 当前成长值
  topTipDesc: string; // 顶部提示
};

export type TExchange = {
  /** 可兑换会员级别列表 */
  exchangeMemberLevel: number[]; // 可兑换会员级别列表
  exchangeImage: string; // 商品图片
  exchangeLabel: string; // 标签
  exchangeId: string; // 积分兑换id
  exchangeTitle: string; // 积分兑换名称
  integralValue: string; // 所需积分总数 eg：150
  couponValue: string; // 优惠券面值
};

export type TIntegralContent = {
  level: number; // 当前登陆用户会员等级
  integralSum: string; // 积分总数
  overdueTips: string; // 过期提示
  announcement: string; // 公告
  exchangeList: TExchange[]; // 积分兑换列表
};

type TIntegralRes = TIntegralContent;

export type TIntegralDetailContent = {
  exchangeMemberLevels: number[]; // 商品可兑换等级
  level: number; // 当前登陆用户会员等级
  rules: {
    // 规则列表
    title: string; // 标题
    desc: string; // 描述
  }[];
  exchangeFlag: number; // 是否可兑换（0-不可以 1-可以）
  btnName: string; // 按钮名称
  exchangeId: string; // 积分兑换id
  name: string; // 商品名称
  spendIntegral: number; // 所需积分
  remain: number; // 剩余数量
  remark: string; // 备注
  ticketValue: string; // 专车券价值
  detailImage: string; // 商品详情图
};

type TIntegralDetailRes = TIntegralDetailContent;

export type TIntegralValue = {
  type: number; // ORDER(0, "订单新增"), INVALID(1, "过期"), OLD_CONVERT(2, "旧积分转换"), EXCHANGE(3, "消费");
  typeDec: string; // 变化的描述
  dateStr: string; // 时间描述（yyyy-MM-dd）
  value: string; // 变化值
  valueDesc: string; // 变化描述
  integralType: number; // 积分类型 1-个人积分 2-企业积分
};

export type TIntegralDetailListRes = {
  totalCount: string; // 总积分
  integralValueList: TIntegralValue[]; // 积分明细列表;
};

// /**
//  * 获取会员权益信息（首页）
//  * @returns Promise
//  */
// export const getMemberGradeInfo = (): Promise<TGradeRes> =>
//   apiData({
//     api: MEMBER_GRADE_INFO,
//   });

// /**
//  * 获取成长值明细列表
//  * @param data
//  * @returns
//  */
// export const getGrowthList = (data: {
//   pageSize: number;
//   pageNo: number;
// }): Promise<TGrowthValueDetailListRes> =>
//   apiData({
//     api: MEMEBER_GROWTH_LIST,
//     data,
//   });

// /**
//  * 获取积分明细列表
//  * @param data
//  * @returns
//  */
// export const getIntegralList = (data: {
//   pageSize: number;
//   currentPage: number;
// }): Promise<TIntegralRes> =>
//   apiData({
//     api: MEMBER_SHIP_INTEGRAL,
//     data,
//   });

// /**
//  * 根据积分进行兑换
//  * @returns Promise
//  */
// export const getProductDetail = (data: {
//   exchangeId: string;
// }): Promise<TIntegralDetailRes> =>
//   apiData({
//     api: GET_PRODUCT_INFO,
//     data,
//   });

// /**
//  * 根据积分进行兑换
//  * @returns Promise
//  */
// export const memberShipGetIntegral = (data: {
//   exchangeId: string;
//   origin: number;
//   spendIntegral?: number;
// }): Promise<{
//   code: number;
//   status: string;
// }> =>
//   apiData({
//     api: MEMBER_SHIP_GET_INTEGRAL,
//     data,
//   });

// /**
//  * 积分明细列表
//  * @param data
//  * @returns
//  */
// export const memberShipIntergalDetailList = (data: {
//   pageSize: number;
//   pageNo: number;
// }): Promise<TIntegralDetailListRes> =>
//   apiData({
//     api: MEMBER_SHIP_INTEGRAL_DETAIL_LIST,
//     data,
//   });
