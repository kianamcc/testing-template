import { Portal } from "./routesConfig";

export type BannerType = "beta" | "cookies" | "survey";

type BannerConfig = Record<Portal, BannerType[]>;

// lists the full width alerts displayed on each Portal,
// ...in the order in which the banners should be dismissed
const bannerConfig: BannerConfig = {
  template: ["cookies"],
};

export default bannerConfig;
