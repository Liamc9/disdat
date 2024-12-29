import React from 'react';
import styled from 'styled-components';
import MenuItem from '../menuitem/MenuItem';

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

const StackedList = ({ category, items }) => {
  return (
    <CategoryWrapper>
      <CategoryTitle>{category}</CategoryTitle>
      <ItemsContainer>
        {items.map((item, index) => (
          <MenuItem 
            key={index} 
            icon={item.icon} /* Pass icon as a React component */ 
            text={item.text} 
            link={item.link} 
          />
        ))}
      </ItemsContainer>
    </CategoryWrapper>
  );
};

export default StackedList;
