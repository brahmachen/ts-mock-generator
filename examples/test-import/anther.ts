export type TGrowthValue = {
  type: number; // OLD(0, "旧会员升级"), ORDER(1, "订单新增"), INVALID(2, "过期");
  typeDec: string; // 变化的描述
  dateStr: string; // 时间描述（yyyy-MM-dd）
  value: string; // 变化值
};
