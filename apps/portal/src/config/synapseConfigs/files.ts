import { SynapseConfig } from "portals-base/types/portal-config";
import { filesSql } from "../resources";

const rgbIndex = 0;

const files: SynapseConfig = {
  name: "QueryWrapperPlotNav",
  props: {
    rgbIndex,
    sql: filesSql,
    name: "Files",
    showExportToCavatica: true,
    isRowSelectionVisible: true,
    rowSelectionPrimaryKey: ["id"],
    fileIdColumnName: "id",
    fileNameColumnName: "name",
    fileVersionColumnName: "currentVersion",
    facetsToPlot: ["fileType"],
    tableConfiguration: {
      showAccessColumn: true,
    },
    searchConfiguration: {
      searchable: ["fileType"],
    },
  },
};

export default files;
