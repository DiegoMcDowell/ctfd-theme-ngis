// Cálculos puros sobre la lista de retos (sin estado ni DOM).

export function summarize(challenges) {
  const total = challenges.length;
  const solved = challenges.filter(c => c.solved_by_me).length;
  const points = challenges.reduce((sum, c) => sum + (c.value || 0), 0);
  const earned = challenges
    .filter(c => c.solved_by_me)
    .reduce((sum, c) => sum + (c.value || 0), 0);
  const percent = total === 0 ? 0 : Math.round((solved / total) * 100);

  return { total, solved, points, earned, percent };
}

export function summarizeCategory(challenges, category) {
  return summarize(challenges.filter(c => c.category === category));
}
