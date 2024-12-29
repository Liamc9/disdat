// src/StripeProvider.js
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51OEhb3Ediyx2YMeqaDZ3I4ygNAKwD7OUiND0hGlHaT9aB3Otvvt7i6Qb2u0UvGCFpI9aLBMcyvxciL1ANLhneoIF008ci3UFkJ');

const StripeProvider = ({ children }) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeProvider;