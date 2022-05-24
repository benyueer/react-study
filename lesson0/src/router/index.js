import React from 'react'
export const routes = [
  {
    path: '/lifecycle',
    component: React.lazy(() => import('../lifeCycle/index')),
    mate: {
      title: 'lifeCycle'
    }
  },
  {
    path: '/context',
    component: React.lazy(() => import('../context/index')),
    mate: {
      title: 'context'
    }
  },
  {
    path: '/HOC',
    component: React.lazy(() => import('../HOC/index')),
    mate: {
      title: 'HOC'
    }
  },
  {
    path: '/Lazy',
    component: React.lazy(() => import('../Lazy/index')),
    mate: {
      title: 'Lazy'
    }
  },
  {
    path: '/Ref',
    component: React.lazy(() => import('../ref/index')),
    mate: {
      title: 'Ref'
    }
  },
  {
    path: '/RenderProps',
    component: React.lazy(() => import('../RenderProps/index')),
    mate: {
      title: 'RenderProps'
    }
  },
]