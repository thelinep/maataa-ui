/**
 * Sidebar navigation for the film production workflows.
 */

export interface NavItem {
  label: string;
  icon: string;
  to: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Pre-production',
    items: [
      { label: 'Concepts', icon: '💡', to: '/concepts' },
      { label: 'Scripts', icon: '📝', to: '/scripts' },
      { label: 'Storyboards', icon: '🎞️', to: '/storyboards' },
    ],
  },
  {
    title: 'Production',
    items: [
      { label: 'Filming', icon: '🎥', to: '/filming' },
      { label: 'Screenings', icon: '🎬', to: '/screenings' },
    ],
  },
  {
    title: 'Post-production',
    items: [
      { label: 'Editing', icon: '✂️', to: '/editing' },
      { label: 'Color Grading', icon: '🎨', to: '/color' },
      { label: 'Sound', icon: '🔊', to: '/sound' },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Projects', icon: '📁', to: '/projects' },
      { label: 'Teams', icon: '👥', to: '/teams' },
      { label: 'Budgets', icon: '💰', to: '/budgets' },
    ],
  },
];
