// Counts are people at one pre-specified index episode. Inputs are aggregates.
function overlapBounds(total, tissueFailures, plasmaFailures, breathFailures) {
  const minimum = Math.max(0, tissueFailures + plasmaFailures - total);
  const maximum = Math.min(tissueFailures, plasmaFailures);
  return {minimum, maximum, technicalMin: Math.max(0, minimum - breathFailures),
    technicalMax: Math.min(maximum, total - breathFailures)};
}
function usableBreathBounds(total, bothFailed, breathFailures) {
  return [Math.max(0, bothFailed - breathFailures), Math.min(bothFailed, total - breathFailures)];
}
function wilson(events, total) {
  if (!total) return null;
  const z = 1.959963984540054, p = events / total, d = 1 + z*z/total;
  const center = (p + z*z/(2*total))/d;
  const radius = z*Math.sqrt(p*(1-p)/total + z*z/(4*total*total))/d;
  return [Math.max(0, center-radius), Math.min(1,center+radius)];
}
function evaluateCounts(counts) {
  if (counts.length !== 6 || counts.some(n => !Number.isSafeInteger(n) || n < 0 || n > 1000000))
    throw new Error('Enter a whole count between 0 and 1,000,000 for every field.');
  const [eligible, baseline, attempted, evaluable, candidate, confirmed] = counts;
  if (!eligible) throw new Error('The eligible cohort must include at least one person.');
  const unresolved = eligible - baseline;
  if (unresolved < 0 || attempted > unresolved || evaluable > attempted ||
      candidate > evaluable || confirmed > candidate)
    throw new Error('Each stage must fit within the previous stage. Breath attempts must fit within the group without a standard-pathway target.');
  return {eligible, unresolved, attempted, evaluable, candidate, confirmed,
    baseline, added:confirmed/eligible, conditional: unresolved ? confirmed/unresolved : null,
    interval:wilson(confirmed,eligible), totalResolved:(baseline+confirmed)/eligible};
}
if (typeof module !== 'undefined') module.exports = {overlapBounds,usableBreathBounds,evaluateCounts,wilson};
