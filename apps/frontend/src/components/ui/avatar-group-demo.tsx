'use client';

import React from 'react';
import { AvatarGroup } from '@/components/ui/avatar-group';

const TECH_STACK_AVATARS = [
  {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    label: 'JavaScript',
    alt: 'JavaScript Logo',
  },
  {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    label: 'React',
    alt: 'React Logo',
  },
  {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    label: 'TypeScript',
    alt: 'TypeScript Logo',
  },
  {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    label: 'MongoDB',
    alt: 'MongoDB Logo',
  },
  {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    label: 'SQL',
    alt: 'SQL Logo',
  },
];

export function TechStackGroup() {
  return (
    <div className="flex items-center justify-center">
      <AvatarGroup avatars={TECH_STACK_AVATARS} maxVisible={5} size={42} overlap={6} />
    </div>
  );
}

export { TechStackGroup as Demo };
