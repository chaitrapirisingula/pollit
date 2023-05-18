import React from 'react';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

/**
 * Icons with corresponding confidence levels.
 */
export const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color='error' />,
    label: 'Very Confused',
  },
  2: {
    icon: <SentimentDissatisfiedIcon color='error' />,
    label: 'Confused',
  },
  3: {
    icon: <SentimentSatisfiedIcon color='warning' />,
    label: 'Somewhat Confident',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color='success' />,
    label: 'Confident',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color='success' />,
    label: 'Super Confident',
  },
};

/**
 * Labelled icons.
 */
export const labelledIcons = {
  'Very Confused': <SentimentVeryDissatisfiedIcon color='error' />,
  'Confused': <SentimentDissatisfiedIcon color='error' />,
  'Somewhat Confident': <SentimentSatisfiedIcon color='warning' />,
  'Confident': <SentimentSatisfiedAltIcon color='success' />,
  'Super Confident': <SentimentVerySatisfiedIcon color='success' />,
};