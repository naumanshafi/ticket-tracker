import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Formik, Form as FormikForm, Field as FormikField } from 'formik';
import { get, mapValues } from 'lodash';

import toast from 'shared/utils/toast';
import { is, generateErrors } from 'shared/utils/validation';

import Field from './Field';

const propTypes = {
  validate: PropTypes.func,
  validations: PropTypes.object,
  validateOnBlur: PropTypes.bool,
};

const defaultProps = {
  validate: undefined,
  validations: undefined,
  validateOnBlur: false,
};

const Form = ({ validate, validations, ...otherProps }) => (
  <Formik
    {...otherProps}
    validate={values => {
      if (validate) {
        return validate(values);
      }
      if (validations) {
        return generateErrors(values, validations);
      }
      return {};
    }}
  />
);

Form.Element = props => <FormikForm noValidate {...props} />;

Form.Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #dfe1e6;
`;

Form.Field = mapValues(Field, FieldComponent => ({ name, validate, ...props }) => (
  <FormikField name={name} validate={validate}>
    {({ field, form: { touched, errors, setFieldValue } }) => (
      <FieldComponent
        {...field}
        {...props}
        name={name}
        error={get(touched, name) && get(errors, name)}
        onChange={value => setFieldValue(name, value)}
      />
    )}
  </FormikField>
));

Form.initialValues = (data, getFieldValues) =>
  getFieldValues((key, defaultValue = '') => {
    const value = get(data, key);
    return value === undefined || value === null ? defaultValue : value;
  });

Form.handleAPIError = (error, form) => {
  if (error.data.fields) {
    form.setErrors(error.data.fields);
  } else {
    toast.error(error);
  }
};

Form.is = is;

Form.propTypes = propTypes;
Form.defaultProps = defaultProps;

export default Form;
