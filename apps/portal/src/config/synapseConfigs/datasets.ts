import { datasetsSql } from "../resources";
import { SynapseConfig } from "portals-base/types/portal-config";
import { CardConfiguration, SynapseConstants } from "synapse-react-client";
import { ColumnSingleValueFilterOperator } from "@sage-bionetworks/synapse-types";
import { DetailsPageProps } from "portals-base/types/portal-util-types";

export const newDatasetsSql = `${datasetsSql} order by ROW_ID desc limit 3`;
const rgbIndex = 8;

export const datasetCardConfiguration: CardConfiguration = {
  type: SynapseConstants.GENERIC_CARD,
  genericCardSchema: {
    type: SynapseConstants.DATASET,
    title: "name",
    description: "description",
    secondaryLabels: ["datasetItemCount"],
  },
  titleLinkConfig: {
    isMarkdown: false,
    matchColumnName: "id",
    URLColumnName: "id",
    baseURL: "Explore/Datasets/DetailsPage",
  },
};
const datasets: SynapseConfig = {
  name: "QueryWrapperPlotNav",
  props: {
    rgbIndex,
    shouldDeepLink: true,
    sql: datasetsSql,
    cardConfiguration: datasetCardConfiguration,
    name: "Datasets",
    facetsToPlot: [""],
    searchConfiguration: {
      searchable: ["name"],
    },
  },
};

export const datasetDetailsPageConfig: DetailsPageProps = {
  sql: datasetsSql,
  sqlOperator: ColumnSingleValueFilterOperator.EQUAL,
  showMenu: false,
  synapseConfigArray: [
    {
      name: "QueryWrapperPlotNav",
      props: {
        rgbIndex,
        sql: "",
        visibleColumnCount: 7,
        tableConfiguration: {
          showAccessColumn: true,
          showDownloadColumn: true,
        },
        shouldDeepLink: false,
        defaultShowPlots: false,
      },
      // tableSqlKeys: ['id'],  // Do not modify the sql where condition based on search params
      overrideSqlSourceTable: true, // Instead, modify the sql (SELECT * FROM <search_param_value>).<rowVersionNumber>
      columnName: "id",
    },
  ],
};

export const datasetsDetailsPage: SynapseConfig[] = [
  {
    name: "CardContainerLogic",
    isOutsideContainer: true,
    props: {
      ...datasetCardConfiguration,
      sql: datasetsSql,
      isHeader: true,
    },
  },
  {
    name: "DetailsPage",
    isOutsideContainer: false,
    props: datasetDetailsPageConfig,
    containerClassName: "DatasetDetailPage container-full-width",
  },
];

export default datasets;
