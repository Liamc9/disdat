import React from "react";
import styled from "styled-components";
import EditableTextField from "../../atoms/menuitem/EditableTextField";
import SelectField from "../../atoms/menuitem/SelectField";
import ToggleField from "../../atoms/menuitem/ToggleField";

const CategoryWrapper = styled.div`
  margin-bottom: 1.5rem; /* Equivalent to mb-6 */
`;

const CategoryTitle = styled.h3`
  font-size: 1.25rem; /* Equivalent to text-xl */
  font-weight: 600; /* Equivalent to font-semibold */
  margin-bottom: 0.5rem; /* Equivalent to mb-2 */
`;

const ItemsContainer = styled.div`
  border: 1px solid #e5e7eb; /* Equivalent to border */
  border-radius: 0.375rem; /* Equivalent to rounded-md */
  overflow: hidden;
  & > *:not(:last-child) {
    border-bottom: 1px solid #e5e7eb; /* Equivalent to divide-y */
  }
`;

const ListItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const EditStackedList = ({ title, items, updateState }) => {
  const renderComponent = (item, index) => {
    const { type, props } = item;

    const childProps = {
      ...props,
      onChange: (newValue) => updateState(props.fieldName, newValue),
    };

    switch (type) {
      case "EditableTextField":
        return <EditableTextField key={index} {...childProps} />;
      case "SelectField":
        return <SelectField key={index} {...childProps} />;
      case "ToggleField":
        return <ToggleField key={index} {...childProps} />;
      default:
        return null;
    }
  };

  return (
    <CategoryWrapper>
      <CategoryTitle>{title}</CategoryTitle>
      <ItemsContainer>
        {items.map((item, index) => (
          <ListItem key={index}>{renderComponent(item, index)}</ListItem>
        ))}
      </ItemsContainer>
    </CategoryWrapper>
  );
};

export default EditStackedList;
