// components/SurveyAlert.tsx
import React from 'react';
import useSurveyPrompt from '../hooks/useSurveyPrompt';

export default function SurveyAlert() {
  useSurveyPrompt();
  return null;
}

// Q: on `sure` what occurs--or how to monitor/track/update user selections for further use
// Context: Currently we send a survey popup every 2 minutes, this isnt the final implementation, but a rought start.
// what can we do to manage the client, the user, and asking for this feedback? like if they come in and use it for 2 minutes at and we ask this isnt bad, but if two minutes later we ask again they may just quit the app, and maybe we should seclude the logic on it anyways incase they dont use the app for more than two minutes maybe we could send a notification after several days or hours of use
// We have `https://forms.gle/YtuDnNBvxf449BQu6` which is a shortened url to the survey form (but we can include the full aswell)
// Moving Forward: we may add other forms, we may use this in different places throughout the app, we should handle state and user interactions more structured