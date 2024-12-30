'use client';

import React from 'react';
import Template from '../../components/template';

export default function InputPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <Template>
      {children}
    </Template>
  );
}
