import { TGrowthValue } from "./anther";
// import { TGrowthValue } from "@/examples/test-import/anther";

export type TGrowthValueDetailListRes = {
  totalCount: string; // 总成长值
  growthValueList: TGrowthValue[]; // 成长值明细列表
};
