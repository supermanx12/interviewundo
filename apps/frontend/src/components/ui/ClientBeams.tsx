'use client';

import dynamic from 'next/dynamic';

const Beams = dynamic(() => import('./Beams'), {
  ssr: false,
});

export default Beams;
