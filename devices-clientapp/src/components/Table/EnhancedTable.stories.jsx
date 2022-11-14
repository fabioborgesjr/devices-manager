import React from 'react'
import EnhancedTable from './EnhancedTable'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
})

export default {
  title: 'Enhanced Table',
  component: EnhancedTable,
}

function Template(args) {
  return (
    <QueryClientProvider client={queryClient}>
      <EnhancedTable {...args} />
    </QueryClientProvider>
  )
}

export const EnhancedTableStory = Template.bind({})
