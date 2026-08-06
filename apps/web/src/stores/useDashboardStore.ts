/*
 * Copyright (c) 2026 ABDUL MOBASIR SARKAR (https://github.com/MobasirSarkar)
 * All Rights Reserved.
 *
 * See LICENSE at the root of this repository.
 */

import { create } from 'zustand';

export type DashboardTab = 'overview' | 'applications' | 'loans';

interface DashboardState {
  activeTab: DashboardTab;
  searchQuery: string;
  setActiveTab: (tab: DashboardTab) => void;
  setSearchQuery: (query: string) => void;
  resetDashboardState: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeTab: 'overview',
  searchQuery: '',
  setActiveTab: (activeTab) => set({ activeTab }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  resetDashboardState: () => set({ activeTab: 'overview', searchQuery: '' }),
}));
