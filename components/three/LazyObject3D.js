'use client';

import dynamic from 'next/dynamic';

// WebGL must run only in the browser; the placeholder reserves the same space.
const Object3D = dynamic(() => import('./Object3D'), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center">
      <div className="h-24 w-24 animate-pulse rounded-full bg-indigo-500/20 blur-xl" />
    </div>
  ),
});

export default function LazyObject3D(props) {
  return <Object3D {...props} />;
}
