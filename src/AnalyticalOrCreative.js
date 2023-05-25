import React from 'react';
import { Header } from './components/Header';
import CamIdentifier from './components/CamIdentifier';


const AnalyticalOrCreative = () => {
  return (
    <div>
      <Header
        title='Analytical Or Creative?'
        subtitle='What does your face say? Find out below if you are an analytical or creative person.'
      />
      <CamIdentifier />
    </div>
  );
};

export default AnalyticalOrCreative;
