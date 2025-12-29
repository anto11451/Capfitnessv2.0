import React from 'react';
import Layout from '@/components/layout/Layout';
import BodyMap from '@/components/BodyMap';

export default function BodyMapPage() {
  return (
    <Layout>
      <div className="space-y-8 h-[calc(100vh-120px)] flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display font-bold text-white">BODY MAP <span className="text-primary">PRO</span></h1>
            <p className="text-muted-foreground">Interactive anatomical explorer</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <BodyMap />
        </div>
      </div>
    </Layout>
  );
}
