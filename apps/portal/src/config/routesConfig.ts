import { GenericRoute } from "portals-base/types/portal-config";

import routeControlWrapperProps from "./routeControlWrapperProps";
import { datasetsDetailsPage } from "./synapseConfigs/datasets";

/**
 * This file defines the routing configuration for the application.
 *
 * - The `routes` array specifies different routes and their settings:
 *   - Each route has a `path`, which determines the URL structure.
 *   - `synapseConfigArray` contains configuration for components displayed on each route.
 *   - Nested routes are used for more specific paths and components.
 *
 * Example:
 * - The root path ("/") displays the "Goals" and "Markdown" sections.
 * - The "Explore" path includes nested routes like "Datasets" and "Files".
 */

const routes: GenericRoute[] = [
  {
    path: "",
    exact: true,
    synapseConfigArray: [
      {
        name: "Goals",
        title: "Our Data",
        centerTitle: true,
        outsideContainerClassName: "home-spacer",
        props: {
          entityId: "syn61670107",
        },
      },
      {
        name: "Markdown",
        title: "Related Resources",
        centerTitle: true,
        props: {
          ownerId: "syn60582629",
          wikiId: "629348",
          loadingSkeletonRowCount: 10,
        },
      },
    ],
  },
  {
    path: "Explore",
    routes: [
      {
        path: ":slug/",
        hideRouteFromNavbar: true,
        exact: true,
        synapseConfigArray: [
          {
            name: "RouteControlWrapper",
            isOutsideContainer: true,
            props: routeControlWrapperProps,
          },
        ],
      },
      {
        path: "Datasets",
        hideRouteFromNavbar: false,
        routes: [
          {
            path: "DetailsPage",
            exact: true,
            synapseConfigArray: datasetsDetailsPage,
          },
        ],
      },
      {
        path: "Files",
        hideRouteFromNavbar: false,
      },
      {
        path: "Publications",
        hideRouteFromNavbar: false,
      },
      {
        path: "Contributors",
        hideRouteFromNavbar: false,
      },
    ],
  },
];

export default routes;
