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
  {
    path: '/hooks',
    component: React.lazy(() => import('../hooks/index')),
    mate: {
      title: 'hooks'
    },
    children: [
      {
        path: '/hooks/state',
        component: React.lazy(() => import('../hooks/State')),
        mate: {
          title: 'state'
        }
      },
      {
        path: '/hooks/effect',
        component: React.lazy(() => import('../hooks/Effect/index')),
        mate: {
          title: 'effect'
        }
      },
      {
        path: '/hooks/ref',
        component: React.lazy(() => import('../hooks/Ref')),
        mate: {
          title: 'ref'
        }
      },
      {
        path: '/hooks/callback',
        component: React.lazy(() => import('../hooks/Callback')),
        mate: {
          title: 'Callback'
        }
      }
    ]
  }
]