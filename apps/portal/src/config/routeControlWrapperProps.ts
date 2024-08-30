import { RouteControlWrapperProps } from "portals-base/components/RouteControlWrapper";
import { datasets, files, publications, contributions } from "./synapseConfigs";

/**
 * This file defines the configuration for route-specific components in the application.
 *
 * - `routeControlWrapperProps` sets up custom routes and their associated configurations:
 *   - Each route in `customRoutes` has a `path` and a `synapseConfigArray`.
 *   - `synapseConfigArray` specifies the configuration for components displayed on that route.
 *
 * Example:
 * - The "Datasets" path displays components configured with `datasets`.
 */

const routeControlWrapperProps: RouteControlWrapperProps = {
  customRoutes: [
    { path: "Datasets", synapseConfigArray: [datasets] },
    { path: "Files", synapseConfigArray: [files] },
    { path: "Publications", synapseConfigArray: [publications] },
    { path: "Contributors", synapseConfigArray: [contributions] },
  ],
};
export default routeControlWrapperProps;
