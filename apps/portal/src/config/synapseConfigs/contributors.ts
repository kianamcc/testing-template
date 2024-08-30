import { SynapseConfig } from "portals-base/types/portal-config";
import { contributorsSql } from "../resources";
import { CardConfiguration, SynapseConstants } from "synapse-react-client";

/**
 * This file defines the configuration for displaying contributor data in the portal.
 *
 * - `initiativeCardConfiguration`: Sets up how contributor information is displayed in a card format.
 *
 * - `contributors`: Is a `SynapseConfig` object that sets up the query and display settings for contributors.
 */

const rgbIndex = 8;

export const initiativeCardConfiguration: CardConfiguration = {
  type: SynapseConstants.GENERIC_CARD,
  genericCardSchema: {
    type: "Contributor",
    title: "fullName",
    secondaryLabels: ["role", "affiliation"],
    description: "summary",
    imageFileHandleColumnName: "image",
  },
};

const contributors: SynapseConfig = {
  name: "QueryWrapperPlotNav",
  props: {
    rgbIndex,
    defaultShowPlots: false,
    shouldDeepLink: true,
    sql: contributorsSql,
    cardConfiguration: {
      ...initiativeCardConfiguration,
    },
    name: "Contributors",
    searchConfiguration: {
      searchable: ["name"],
    },
  },
};

export default contributors;
