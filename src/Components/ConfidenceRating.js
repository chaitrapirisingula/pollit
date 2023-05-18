import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import { customIcons } from './ConfidenceIcons';

/**
 * Styling for unselected icons.
 */
const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
    color: theme.palette.action.disabled,
  },
}));

/**
 * Display icon based on confidence level.
 * 
 * @param {*} props 
 * @returns valid icon
 */
function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

/**
 * Use number type for confidence level.
 */
IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};

/**
 * Component for confidence selection.
 * 
 * @param {*} param0 
 * @returns rating component
 */
export default function ConfidenceRating( { handleChild } ) {

  const [level, setLevel] = useState(5);

  const handleChange = (event, newLevel) => {
    if (newLevel && newLevel !== level && newLevel > 0 && newLevel < 6) {
      setLevel(newLevel);
      handleChild(customIcons[newLevel].label);
    }
  };

  return (
    <div className='confidence-levels'>
      <StyledRating
      name='highlight-selected-only'
      value={level}
      IconContainerComponent={IconContainer}
      getLabelText={(value) => value ? customIcons[value].label : ''}
      onChange={handleChange}
      highlightSelectedOnly
      />
      <p>{customIcons[level] ? customIcons[level].label : ''}</p>
    </div>
  );
}