import { DataQuery, DataSourceJsonData, DataSourceSettings } from '@grafana/data';

import {
  QueryEditorColumnsExpression,
  QueryEditorExpressionType,
  QueryEditorGroupByExpressionArray,
  QueryEditorOperatorExpression,
  QueryEditorPropertyExpression,
  QueryEditorReduceExpressionArray,
  QueryEditorWhereArrayExpression,
} from './components/LegacyQueryEditor/editor/expressions';
import { AzureCredentials } from 'components/ConfigEditor/AzureCredentials';

const packageJson = require('../package.json');

export interface QueryExpression {
  from?: QueryEditorPropertyExpression;
  columns?: QueryEditorColumnsExpression;
  where: QueryEditorWhereArrayExpression;
  reduce: QueryEditorReduceExpressionArray;
  groupBy: QueryEditorGroupByExpressionArray;
  timeshift?: QueryEditorPropertyExpression;
}

type QuerySource = 'raw' | 'schema' | 'autocomplete' | 'visual' | 'openai';
export interface KustoQuery extends DataQuery {
  query: string;
  database: string;
  alias?: string;
  resultFormat: string;
  expression: QueryExpression;
  rawMode?: boolean;
  querySource: QuerySource;
  pluginVersion: string;
  queryType: AdxQueryType;
  table?: string;
  OpenAI?: boolean;
}

export interface AutoCompleteQuery {
  database: string;
  search: QueryEditorOperatorExpression;
  expression: QueryExpression;
  index?: string;
}

export enum EditorMode {
  Visual = 'visual',
  Raw = 'raw',
  OpenAI = 'openai',
}

export enum AdxQueryType {
  Databases = 'Databases',
  KustoQuery = 'KQL',
  Tables = 'Tables',
  Columns = 'Columns',
}

export const defaultQuery: Pick<KustoQuery, 'query' | 'expression' | 'querySource' | 'pluginVersion' | 'queryType'> = {
  query: '',
  querySource: EditorMode.Raw,
  expression: {
    where: {
      type: QueryEditorExpressionType.And,
      expressions: [],
    },
    groupBy: {
      type: QueryEditorExpressionType.And,
      expressions: [],
    },
    reduce: {
      type: QueryEditorExpressionType.And,
      expressions: [],
    },
  },
  pluginVersion: packageJson.version,
  queryType: AdxQueryType.KustoQuery,
};

export interface SchemaMapping {
  type: SchemaMappingType;
  value: string;
  name: string;
  database: string;
  displayName: string;
}

export interface SchemaMappingOption {
  label: string;
  value: string;
  type: SchemaMappingType;
  name: string;
  database: string;
  input?: AdxFunctionInputParameterSchema[];
}

export enum SchemaMappingType {
  function = 'function',
  table = 'table',
  materializedView = 'materializedView',
}

export interface AdxDataSourceOptions extends DataSourceJsonData {
  defaultDatabase: string;
  minimalCache: number;
  defaultEditorMode: EditorMode;
  queryTimeout: string;
  dataConsistency: string;
  cacheMaxAge: string;
  dynamicCaching: boolean;
  useSchemaMapping: boolean;
  schemaMappings?: Array<Partial<SchemaMapping>>;
  enableUserTracking: boolean;
  clusterUrl: string;
  azureCredentials?: AzureCredentials;
  onBehalfOf?: boolean;
}

export interface AdxDataSourceSecureOptions {
  OpenAIAPIKey?: string;
}

export interface AdxSchema {
  Databases: Record<string, AdxDatabaseSchema>;
}

export interface AdxDatabaseSchema {
  Name: string;
  Tables: Record<string, AdxTableSchema>;
  ExternalTables: Record<string, AdxTableSchema>;
  Functions: Record<string, AdxFunctionSchema>;
  MaterializedViews: Record<string, AdxTableSchema>;
}

export interface AdxTableSchema {
  Name: string;
  OrderedColumns: AdxColumnSchema[];
}

export interface AdxColumnSchema {
  Name: string;
  CslType: string;
  Type?: string;
  CslDefaultValue?: string;
  isDynamic?: boolean;
}

export interface AdxFunctionSchema {
  Body: string;
  FunctionKind: string;
  Name: string;
  InputParameters: AdxFunctionInputParameterSchema[];
  OutputColumns: AdxColumnSchema[];
  DocString?: string;
}

export interface AdxFunctionInputParameterSchema extends AdxColumnSchema {}

export type AdxSchemaDefinition = string | AdxSchemaDefinition[] | { [k: string]: AdxSchemaDefinition };

export enum FormatOptions {
  table = 'table',
  timeSeries = 'time_series',
  adxTimeSeries = 'time_series_adx_series',
  trace = 'trace',
}

export type AdxDataSourceSettings = DataSourceSettings<AdxDataSourceOptions, AdxDataSourceSecureOptions>;

export type DeepPartial<K> = {
  [attr in keyof K]?: K[attr] extends object ? DeepPartial<K[attr]> : K[attr];
};
