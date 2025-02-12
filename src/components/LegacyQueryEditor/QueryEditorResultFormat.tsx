import { css } from '@emotion/css';
import { GrafanaTheme2, SelectableValue } from '@grafana/data';
import { InlineFormLabel, Select, useStyles2 } from '@grafana/ui';
import React, { useCallback } from 'react';

interface Props {
  format: string;
  onChangeFormat: (format: string) => void;
  includeAdxTimeFormat: boolean;
}

const formats: Array<SelectableValue<string>> = [
  { label: 'Table', value: 'table' },
  { label: 'Time series', value: 'time_series' },
];

const adxTimeFormat: SelectableValue<string> = {
  label: 'ADX Time series',
  value: 'time_series_adx_series',
};

export const QueryEditorResultFormat: React.FC<Props> = (props) => {
  const { onChangeFormat } = props;
  const onFormatChange = useCallback(
    (selectable: SelectableValue<string>) => {
      if (!selectable || !selectable.value) {
        return;
      }
      onChangeFormat(selectable.value);
    },
    [onChangeFormat]
  );

  const styles = useStyles2(getStyles);

  return (
    <div className={styles.container}>
      <InlineFormLabel className="query-keyword" width={6}>
        Format as
      </InlineFormLabel>
      <Select
        options={props.includeAdxTimeFormat ? [...formats, adxTimeFormat] : formats}
        value={props.format}
        onChange={onFormatChange}
        menuShouldPortal
      />
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    display: flex;
    flex-direction: row;
    margin-right: 4px;
  `,
});

export const selectResultFormat = (format?: string, includeAdxFormat?: boolean): string => {
  const selected = formats.find((f) => f.value === format);

  if (includeAdxFormat && adxTimeFormat.value) {
    if (adxTimeFormat.value === format) {
      return adxTimeFormat.value;
    }
  }

  if (selected && selected.value) {
    return selected.value;
  }

  if (formats.length > 0 && formats[0].value) {
    return formats[0].value;
  }

  return 'time_series';
};
