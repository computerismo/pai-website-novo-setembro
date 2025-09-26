import type { MDXComponents } from 'mdx/types';
import components from '@/components/blog/MDXComponents';

export function useMDXComponents(userComponents: MDXComponents): MDXComponents {
  return {
    ...components,
    ...userComponents,
  };
}