export const getRiskColor = (riskLevel) => {
  if (riskLevel === 'HIGH') return 'text-red-500';
  if (riskLevel === 'MEDIUM') return 'text-yellow-500';
  return 'text-green-500';
};

export const getRiskBgColor = (riskLevel) => {
  if (riskLevel === 'HIGH') return 'bg-red-500/20 border-red-500';
  if (riskLevel === 'MEDIUM') return 'bg-yellow-500/20 border-yellow-500';
  return 'bg-green-500/20 border-green-500';
};

export const getRiskRecommendation = (riskLevel) => {
  const recommendations = {
    'HIGH': 'Immediate evacuation and monitoring recommended. Contact local authorities.',
    'MEDIUM': 'Heightened alert. Prepare evacuation plan and monitor weather.',
    'LOW': 'Normal conditions. Continue regular monitoring procedures.'
  };
  return recommendations[riskLevel] || 'Monitor situation';
};

export const getRiskIcon = (riskLevel) => {
  if (riskLevel === 'HIGH') return '⚠️';
  if (riskLevel === 'MEDIUM') return '⚡';
  return '✓';
};
