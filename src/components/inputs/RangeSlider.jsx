import React, { useState } from "react";
import styled from "styled-components";

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const RangeInputContainer = styled.div`
  position: relative;
  width: 100%;
  height: 50px;
`;

const Track = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 8px;
  background: #e0e0e0;
  border-radius: 5px;
  width: 100%;

  &::after {
    content: "";
    position: absolute;
    left: ${(props) => props.left}%;
    right: ${(props) => 100 - props.right}%;
    height: 100%;
    background: #A855F7;
    border-radius: 5px;
    z-index: 1;
  }
`;

const ThumbValue = styled.div`
  position: absolute;
  top: -10px;
  font-size: 16px;
  font-weight: bold;
  color: #A855F7;
  white-space: nowrap;
`;

const Slider = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  background: transparent;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  pointer-events: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: #A855F7;
    border-radius: 50%;
    cursor: pointer;
    pointer-events: auto;
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    background: #007bff;
    border-radius: 50%;
    cursor: pointer;
    pointer-events: auto;
  }
`;

const RangeSlider = ({
  min = 0,
  max = 100,
  step = 1,
  minimumGap = 10,
  label = "Range",
  valuePrefix = "",
  valueSuffix = "",
  onChange,
}) => {
  const [range, setRange] = useState([min, max]);

  const handleMinChange = (e) => {
    const newMin = Math.min(Number(e.target.value), range[1] - minimumGap);
    const newRange = [newMin, range[1]];
    setRange(newRange);
    if (onChange) onChange(newRange);
  };

  const handleMaxChange = (e) => {
    const newMax = Math.max(Number(e.target.value), range[0] + minimumGap);
    const newRange = [range[0], newMax];
    setRange(newRange);
    if (onChange) onChange(newRange);
  };

  const calculatePercentage = (value) => ((value - min) / (max - min)) * 100;

  return (
    <SliderContainer>
      <Label>{label}</Label>
      <RangeInputContainer>
        <ThumbValue
          style={{
            left: `calc(${calculatePercentage(range[0])}% - 14px)`,
          }}
        >
          {valuePrefix}
          {range[0]}
          {valueSuffix}
        </ThumbValue>
        <ThumbValue
          style={{
            left: `calc(${calculatePercentage(range[1])}% - 14px)`,
          }}
        >
          {valuePrefix}
          {range[1]}
          {valueSuffix}
        </ThumbValue>
        <Track
          left={calculatePercentage(range[0])}
          right={calculatePercentage(range[1])}
        />
        <Slider
          type="range"
          min={min}
          max={max}
          step={step}
          value={range[0]}
          onChange={handleMinChange}
        />
        <Slider
          type="range"
          min={min}
          max={max}
          step={step}
          value={range[1]}
          onChange={handleMaxChange}
        />
      </RangeInputContainer>
    </SliderContainer>
  );
};

export default RangeSlider;
