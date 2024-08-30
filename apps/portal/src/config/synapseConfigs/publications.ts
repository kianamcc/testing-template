import { SynapseConstants } from "synapse-react-client";
import { SynapseConfig } from "portals-base/types/portal-config";
import type { CardConfiguration } from "synapse-react-client";

import { publicationsSql } from "../resources";

export const newPublicationsSql = `${publicationsSql} order by ROW_ID desc limit 3`;
const type = SynapseConstants.GENERIC_CARD;
const rgbIndex = 0;

export const publicationsCardConfiguration: CardConfiguration = {
  type,
  labelLinkConfig: [
    {
      isMarkdown: true,
      matchColumnName: "doi",
    },
  ],
  genericCardSchema: {
    title: "publication",
    type: SynapseConstants.PUBLICATION,
    secondaryLabels: ["journal", "date", "doi"],
  },
};

const publications: SynapseConfig = {
  name: "QueryWrapperPlotNav",
  props: {
    rgbIndex,
    sql: publicationsSql,
    shouldDeepLink: true,
    name: "Publications",
    cardConfiguration: publicationsCardConfiguration,
    facetsToPlot: [""],
    searchConfiguration: {
      searchable: ["journal"],
    },
    defaultShowPlots: false,
  },
};

export default publications;
