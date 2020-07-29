import React, { PureComponent } from 'react';
import { css } from 'emotion';
import { stylesFactory } from '@grafana/ui';
import { QueryEditorOperatorExpression } from '../types';
import { QueryEditorFieldDefinition, QueryEditorOperatorDefinition } from '../../types';
import { QueryEditorField, QueryEditorFieldExpression } from '../field/QueryEditorField';
import { QueryEditorOperator, verifyOperatorValues } from '../operators/QueryEditorOperator';
import { QueryEditorExpression, QueryEditorExpressionType } from '../../../types';
import { SelectableValue } from '@grafana/data';

interface Props {
  value?: QueryEditorFieldAndOperatorExpression;
  fields: QueryEditorFieldDefinition[];
  templateVariableOptions: SelectableValue<string>;
  operators: QueryEditorOperatorDefinition[];
  onChange: (expression: QueryEditorFieldAndOperatorExpression | undefined) => void;
}

export interface QueryEditorFieldAndOperatorExpression extends QueryEditorExpression {
  field: QueryEditorFieldExpression;
  operator: QueryEditorOperatorExpression;
}

interface State {
  // operators we can use for the field
  operators: QueryEditorOperatorDefinition[];
}

export class QueryEditorFieldAndOperator extends PureComponent<Props, State> {
  state: State = { operators: [] };

  componentDidMount = () => {
    const field = this.props.value?.field;
    if (field) {
      this.updateOperators(field);
    }
  };

  // Find the valid operators to the given field and save it in state
  updateOperators = (field: QueryEditorFieldExpression): QueryEditorOperatorDefinition[] => {
    const operators: QueryEditorOperatorDefinition[] = [];
    for (const op of this.props.operators) {
      if (op.supportTypes.includes(field.fieldType)) {
        operators.push(op);
      }
    }
    this.setState({ operators });
    return operators;
  };

  onFieldChanged = (expression: QueryEditorFieldExpression) => {
    let next = {
      ...this.props.value!,
      field: expression,
    };

    const operators = this.updateOperators(expression);
    const currentOperator = next.operator?.operator?.value;
    if (operators.length && !operators.find(op => op.value === currentOperator)) {
      next.operator = {
        type: QueryEditorExpressionType.Operator,
        operator: {
          ...operators[0],
        },
      };
    }

    // Give it default values
    next.operator = verifyOperatorValues(next.operator);
    this.props.onChange(next);
  };

  onOperatorChange = (expression: QueryEditorOperatorExpression) => {
    this.props.onChange({
      ...this.props.value!,
      operator: expression,
    });
  };

  render() {
    const { value, fields, templateVariableOptions } = this.props;
    const { operators } = this.state;

    const styles = getStyles();
    const showOperators = value?.operator || value?.field;

    return (
      <div className={styles.container}>
        <QueryEditorField
          value={value?.field}
          fields={fields}
          templateVariableOptions={templateVariableOptions}
          onChange={this.onFieldChanged}
          placeholder="Choose column..."
        />
        {showOperators && (
          <QueryEditorOperator value={value?.operator} operators={operators} onChange={this.onOperatorChange} />
        )}
      </div>
    );
  }
}

export const isFieldAndOperator = (
  expression: QueryEditorExpression
): expression is QueryEditorFieldAndOperatorExpression => {
  return (expression as QueryEditorFieldAndOperatorExpression)?.type === QueryEditorExpressionType.FieldAndOperator;
};

const getStyles = stylesFactory(() => {
  return {
    container: css`
      display: flex;
      flex-direction: row;
    `,
  };
});
