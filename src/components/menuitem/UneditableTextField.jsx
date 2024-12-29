import React from 'react';
import styled from 'styled-components';

const FieldContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #fff; /* Background for the field */
  transition: background-color 0.3s;

  &:hover {
    background-color: #f9fafb; /* Slightly darker hover background equivalent to hover:bg-gray-50 */
  }
`;

const IconWrapper = styled.div`
  margin-right: 20px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280; /* Equivalent to text-gray-500 */
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const FieldName = styled.div`
  font-size: 12px;
  color: #9ca3af; /* Equivalent to text-gray-400 */
`;

const FieldValue = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #111827; /* Equivalent to text-gray-900 */
`;

const UneditableTextField = ({ icon: IconComponent, name, value }) => {
  return (
    <FieldContainer>
      {IconComponent && (
        <IconWrapper>
          <IconComponent />
        </IconWrapper>
      )}
      <TextWrapper>
        <FieldName>{name}</FieldName>
        <FieldValue>{value}</FieldValue>
      </TextWrapper>
    </FieldContainer>
  );
};

export default UneditableTextField;
