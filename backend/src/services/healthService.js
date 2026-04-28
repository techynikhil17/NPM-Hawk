export function computeHealthScore(npmsData, githubData, securityData, weeklyDownloads) {
  const scores = {};

  // MAINTENANCE (30 pts)
  if (npmsData?.evaluation?.maintenance) {
    const m = npmsData.evaluation.maintenance;
    scores.maintenance = Math.min(30, Math.round(
      (m.releasesFrequency || 0) * 10 +
      (m.commitsFrequency || 0) * 10 +
      ((1 - (m.openIssues || 0)) * 5) +
      ((m.issuesDistribution || 0) * 5)
    ));
  } else {
    scores.maintenance = 0;
  }

  // POPULARITY (20 pts)
  const dl = weeklyDownloads || 0;
  const stars = githubData?.stars || 0;
  scores.popularity = Math.min(20, Math.round(
    Math.min(10, Math.log10(dl + 1) * 1.5) +
    Math.min(10, Math.log10(stars + 1) * 2)
  ));

  // QUALITY (20 pts)
  if (npmsData?.evaluation?.quality) {
    const q = npmsData.evaluation.quality;
    scores.quality = Math.min(20, Math.round(
      (q.carefulness || 0) * 8 +
      (q.tests || 0) * 7 +
      (q.health || 0) * 3 +
      (q.branding || 0) * 2
    ));
  } else {
    scores.quality = 10;
  }

  // SECURITY (20 pts)
  const vulns = securityData?.vulnerabilities || [];
  const critical = vulns.filter((v) =>
    ["CRITICAL", "HIGH"].includes(String(v.severity).toUpperCase())
  ).length;
  scores.security = Math.max(0, 20 - critical * 8 - (vulns.length - critical) * 2);

  // COMMUNITY (10 pts)
  scores.community = Math.min(10, Math.round(
    Math.min(5, Math.log10((githubData?.forks || 0) + 1) * 2.5) +
    (githubData?.hasIssues ? 3 : 0) +
    (githubData?.license ? 2 : 0)
  ));

  const total = Math.min(100, Object.values(scores).reduce((a, b) => a + b, 0));
  const grade = total >= 90 ? "A+" : total >= 80 ? "A" : total >= 70 ? "B" :
                total >= 60 ? "C" : total >= 40 ? "D" : "F";

  return { total, grade, breakdown: scores };
}
