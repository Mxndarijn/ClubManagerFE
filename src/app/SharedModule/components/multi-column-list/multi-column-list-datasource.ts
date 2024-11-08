// Interface representing the data source for a multi-column list
import {TemplateRef} from "@angular/core";
import {BehaviorSubject} from "rxjs";

export interface MultiColumnListDataSource {

  isDataLoading : boolean;
  // Indicates if the search functionality is enabled for the list
  canSearch: boolean;

  // Function to check if a data row matches the search criteria based on a search value
  isInSearch?: (dataRow: any, searchValue: string) => boolean;

  // Array of data rows to be displayed in the list/table
  dataRows: BehaviorSubject<any[]>;

  // Array of column configurations, defining sorting and display settings
  columns: ColumnDataSource[];

  // Number of rows initially displayed before loading additional rows
  initialRowCount: number;

  // Indicates whether more rows are available for loading
  hasMoreRows: boolean;

  // Function to load more rows when additional data is required
  loadAdditionalRows?: (currentRows: any[]) => any[];

  // Placeholder text displayed in the search input field
  searchPlaceholder?: string;

  // Function to search for additional items not currently in dataRows
  searchForAdditionalItems?: (searchValue: string) => any[];

  emptyMessage: string;
}

// Interface representing a configuration for an individual column in the table
export interface ColumnDataSource {
  // Defines the sorting type for the column (e.g., alphabetical, numerical)
  sortType: ColumnSortType;

  // Generates and returns an HTML element representing the table header cell for this column
  headerCell: TemplateRef<any>;

  // Generates and returns an HTML element representing a row cell for this column based on a given data row
  rowCell: TemplateRef<any>;
  getRawValueToSort?: (dataRow: any) => any;
}

// Enum defining sorting types available for columns in the table
export enum ColumnSortType {
  ALPHABETICAL,  // Sort by alphabetical order
  NUMERICAL,     // Sort by numerical value
  DATE,          // Sort by date order
  NONE           // No sorting applied
}
