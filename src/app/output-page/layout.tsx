'use client';

import React from 'react';
import Template from '../../components/template';
import { Providers } from '../providers';

export default function OutputPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <Template>
      <Providers>{children}</Providers>
    </Template>
  );
}
