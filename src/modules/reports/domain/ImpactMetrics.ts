export interface ImpactMetrics {
  totalFundsRaised: number;
  fundsAllocatedToProjects: number;
  generalFundBalance: number;
  projectsStatusDistribution: {
    planning: number;
    active: number;
    completed: number;
  };
  volunteersGrowth: number;
}
