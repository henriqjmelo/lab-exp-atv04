import { useEffect, useState } from 'react';
import { parseCsv } from '@/lib/csv';

export interface RepoRow {
  domain: string;
  language: string;
  stars: number;
  forks: number;
  openIssues: number;
  ownerType: string;
  createdYear: number;
}

export interface RepoData {
  loading: boolean;
  rows: RepoRow[];
  totalRepos: number;
  totalLanguages: number;
  totalDomains: number;
  avgStars: number;
  avgForks: number;
  languageCounts: { name: string; value: number }[];
  domainCounts: { name: string; value: number }[];
  ownerTypeCounts: { name: string; value: number }[];
  reposByYear: { year: string; repos: number }[];
  starsByLanguage: { name: string; avgStars: number }[];
  starsVsForks: { stars: number; forks: number; name: string }[];
  ownerVsStars: { name: string; avgStars: number }[];
  allLanguages: string[];
  allDomains: string[];
  allYears: number[];
}

const EMPTY: RepoData = {
  loading: true,
  rows: [],
  totalRepos: 0,
  totalLanguages: 0,
  totalDomains: 0,
  avgStars: 0,
  avgForks: 0,
  languageCounts: [],
  domainCounts: [],
  ownerTypeCounts: [],
  reposByYear: [],
  starsByLanguage: [],
  starsVsForks: [],
  ownerVsStars: [],
  allLanguages: [],
  allDomains: [],
  allYears: [],
};

function topEntries(counts: Map<string, number>, limit: number) {
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, value]) => ({ name, value }));
}

export function useRepoData(): RepoData {
  const [data, setData] = useState<RepoData>(EMPTY);

  useEffect(() => {
    let cancelled = false;

    fetch('/github_top_repositories.csv')
      .then((res) => res.text())
      .then((text) => {
        if (cancelled) return;

        const records = parseCsv(text);
        const rows: RepoRow[] = records
          .filter((record) => record['Repository Name'])
          .map((record) => ({
            domain: record['Domain'] || 'Outro',
            language: record['Primary Language'] || 'Não informado',
            stars: Number(record['Stars Count']) || 0,
            forks: Number(record['Forks Count']) || 0,
            openIssues: Number(record['Open Issues Count']) || 0,
            ownerType: record['Owner Type'] || 'Não informado',
            createdYear: Number(record['Created At']?.slice(0, 4)) || 0,
          }));

        const languageMap = new Map<string, number>();
        const domainMap = new Map<string, number>();
        const ownerTypeMap = new Map<string, number>();
        const yearMap = new Map<number, number>();
        const starsByLanguageMap = new Map<string, { sum: number; count: number }>();
        const ownerStarsMap = new Map<string, { sum: number; count: number }>();
        let starsSum = 0;
        let forksSum = 0;

        for (const row of rows) {
          if (row.language !== 'Não informado') {
            languageMap.set(row.language, (languageMap.get(row.language) ?? 0) + 1);
          }
          domainMap.set(row.domain, (domainMap.get(row.domain) ?? 0) + 1);
          ownerTypeMap.set(row.ownerType, (ownerTypeMap.get(row.ownerType) ?? 0) + 1);
          if (row.createdYear) {
            yearMap.set(row.createdYear, (yearMap.get(row.createdYear) ?? 0) + 1);
          }

          const langStats = starsByLanguageMap.get(row.language) ?? { sum: 0, count: 0 };
          langStats.sum += row.stars;
          langStats.count += 1;
          starsByLanguageMap.set(row.language, langStats);

          const ownerStats = ownerStarsMap.get(row.ownerType) ?? { sum: 0, count: 0 };
          ownerStats.sum += row.stars;
          ownerStats.count += 1;
          ownerStarsMap.set(row.ownerType, ownerStats);

          starsSum += row.stars;
          forksSum += row.forks;
        }

        const reposByYear = Array.from(yearMap.entries())
          .filter(([year]) => year >= 2008)
          .sort((a, b) => a[0] - b[0])
          .map(([year, repos]) => ({ year: String(year), repos }));

        const topLanguagesByCount = topEntries(languageMap, 5).map((entry) => entry.name);
        const starsByLanguage = topLanguagesByCount.map((name) => {
          const langStats = starsByLanguageMap.get(name)!;
          return { name, avgStars: Math.round(langStats.sum / langStats.count) };
        });

        const ownerVsStars = Array.from(ownerStarsMap.entries()).map(([name, stats]) => ({
          name,
          avgStars: Math.round(stats.sum / stats.count),
        }));

        const starsVsForks = rows
          .slice()
          .sort((a, b) => b.stars - a.stars)
          .slice(0, 200)
          .map((row) => ({ stars: row.stars, forks: row.forks, name: row.language }));

        const allLanguages = Array.from(languageMap.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([name]) => name);

        const allDomains = Array.from(domainMap.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([name]) => name);

        const allYears = Array.from(yearMap.keys())
          .filter((year) => year >= 2008)
          .sort((a, b) => a - b);

        setData({
          loading: false,
          rows,
          totalRepos: rows.length,
          totalLanguages: languageMap.size,
          totalDomains: domainMap.size,
          avgStars: rows.length ? Math.round(starsSum / rows.length) : 0,
          avgForks: rows.length ? Math.round(forksSum / rows.length) : 0,
          languageCounts: topEntries(languageMap, 10),
          domainCounts: topEntries(domainMap, 15),
          ownerTypeCounts: topEntries(ownerTypeMap, 10),
          reposByYear,
          starsByLanguage,
          starsVsForks,
          ownerVsStars,
          allLanguages,
          allDomains,
          allYears,
        });
      })
      .catch(() => {
        if (!cancelled) setData((current) => ({ ...current, loading: false }));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}
