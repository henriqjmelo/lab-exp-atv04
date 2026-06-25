import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  Code2,
  Database,
  GitFork,
  LayoutDashboard,
  Layers,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  type LucideIcon,
} from 'lucide-react';
import { useRepoData, type RepoRow } from '@/hooks/useRepoData';
import { MultiSelectFilter } from '@/components/MultiSelectFilter';

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#0891b2', '#ca8a04', '#4f46e5', '#dc2626', '#0d9488'];

const CARD_CLASS =
  'rounded-2xl border-0 bg-white shadow-sm ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-lg';

const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: '1px solid #e5e7eb',
  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
};

interface AnalysisCard {
  id: string;
  title: string;
  description: string;
  order: number;
}

const analysisCards: AnalysisCard[] = [
  {
    id: 'evolucao',
    title: 'Evolução Temporal',
    description: 'Criação de repositórios por ano',
    order: 1,
  },
  {
    id: 'stars',
    title: 'Stars por Linguagem',
    description: 'Média de stars das linguagens mais comuns (Top 5)',
    order: 2,
  },
  {
    id: 'correlacao',
    title: 'Correlação de Métricas',
    description: 'Relação entre stars e forks (Top 200 repositórios)',
    order: 3,
  },
  {
    id: 'owner',
    title: 'Impacto do Proprietário',
    description: 'Influência do tipo de proprietário na popularidade',
    order: 4,
  },
];

function countByField(rows: RepoRow[], field: 'language' | 'domain' | 'ownerType', limit?: number) {
  const map = new Map<string, number>();
  for (const row of rows) {
    const key = row[field];
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  const entries = Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));
  return limit ? entries.slice(0, limit) : entries;
}

function avgByField(rows: RepoRow[], groupField: 'language' | 'domain', valueField: 'stars' | 'forks' | 'openIssues') {
  const map = new Map<string, { sum: number; count: number }>();
  for (const row of rows) {
    const key = row[groupField];
    const stats = map.get(key) ?? { sum: 0, count: 0 };
    stats.sum += row[valueField];
    stats.count += 1;
    map.set(key, stats);
  }
  return Array.from(map.entries())
    .map(([name, stats]) => ({ name, value: stats.count ? Math.round(stats.sum / stats.count) : 0 }))
    .sort((a, b) => b.value - a.value);
}

const KPI_COLORS = {
  blue: 'bg-blue-100 text-blue-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  purple: 'bg-purple-100 text-purple-600',
  pink: 'bg-pink-100 text-pink-600',
  orange: 'bg-orange-100 text-orange-600',
} as const;

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: keyof typeof KPI_COLORS;
}

function KpiCard({ icon: Icon, label, value, color }: KpiCardProps) {
  return (
    <Card className={`${CARD_CLASS} hover:-translate-y-1`}>
      <CardContent className="flex items-center gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${KPI_COLORS[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const data = useRepoData();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'default' | 'alphabetical'>('default');

  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  const filteredAnalysisCards = analysisCards
    .filter((card) =>
      [card.title, card.description].some((text) =>
        text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortOption === 'alphabetical') {
        return a.title.localeCompare(b.title, 'pt-BR');
      }
      return a.order - b.order;
    });

  const totalRepos = data.loading ? 3000 : data.totalRepos;
  const totalLanguages = data.loading ? 54 : data.totalLanguages;
  const totalDomains = data.loading ? 15 : data.totalDomains;
  const avgStars = data.loading ? 20783 : data.avgStars;
  const avgForks = data.loading ? 3325 : data.avgForks;

  const yearOptions = useMemo(() => data.allYears.map((year) => String(year)), [data.allYears]);

  const overviewRows = useMemo(() => {
    if (selectedYears.length === 0) return data.rows;
    return data.rows.filter((row) => selectedYears.includes(String(row.createdYear)));
  }, [data.rows, selectedYears]);

  const overviewKpis = useMemo(() => {
    const languages = new Set(
      overviewRows.map((row) => row.language).filter((language) => language !== 'Não informado')
    );
    const domains = new Set(overviewRows.map((row) => row.domain));
    const starsSum = overviewRows.reduce((sum, row) => sum + row.stars, 0);
    return {
      totalRepos: overviewRows.length,
      totalLanguages: languages.size,
      totalDomains: domains.size,
      avgStars: overviewRows.length ? Math.round(starsSum / overviewRows.length) : 0,
    };
  }, [overviewRows]);

  const overviewLanguageCounts = useMemo(() => countByField(overviewRows, 'language', 10), [overviewRows]);

  const activeLanguages = selectedLanguages.length > 0 ? selectedLanguages : data.allLanguages.slice(0, 5);

  const languageRows = useMemo(
    () => data.rows.filter((row) => activeLanguages.includes(row.language)),
    [data.rows, activeLanguages]
  );

  const starsByLanguageFiltered = useMemo(() => avgByField(languageRows, 'language', 'stars'), [languageRows]);
  const forksByLanguageFiltered = useMemo(() => avgByField(languageRows, 'language', 'forks'), [languageRows]);
  const issuesByLanguageFiltered = useMemo(() => avgByField(languageRows, 'language', 'openIssues'), [languageRows]);

  const languageEvolution = useMemo(() => {
    const yearMap = new Map<number, Record<string, number>>();
    for (const row of languageRows) {
      if (!row.createdYear || row.createdYear < 2008) continue;
      const entry = yearMap.get(row.createdYear) ?? {};
      entry[row.language] = (entry[row.language] ?? 0) + 1;
      yearMap.set(row.createdYear, entry);
    }
    return Array.from(yearMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([year, counts]) => ({ year: String(year), ...counts }));
  }, [languageRows]);

  const activeDomains = selectedDomains.length > 0 ? selectedDomains : data.allDomains.slice(0, 8);

  const domainRows = useMemo(
    () => data.rows.filter((row) => activeDomains.includes(row.domain)),
    [data.rows, activeDomains]
  );

  const domainCountsFiltered = useMemo(() => countByField(domainRows, 'domain'), [domainRows]);
  const starsByDomainFiltered = useMemo(() => avgByField(domainRows, 'domain', 'stars'), [domainRows]);
  const ownerTypeInDomain = useMemo(() => countByField(domainRows, 'ownerType'), [domainRows]);

  function renderAnalysisChart(id: string) {
    switch (id) {
      case 'evolucao':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.reposByYear}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" />
              <YAxis allowDecimals={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="repos" name="Repositórios" stroke="#2563eb" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'stars':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.starsByLanguage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="avgStars" name="Média de Stars" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'correlacao':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" dataKey="stars" name="Stars" />
              <YAxis type="number" dataKey="forks" name="Forks" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={TOOLTIP_STYLE} formatter={(value: number) => value.toLocaleString()} />
              <Scatter data={data.starsVsForks} fill="#db2777" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      case 'owner':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.ownerVsStars}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="avgStars" name="Média de Stars" fill="#ea580c" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
        <div className="container relative mx-auto px-4 py-10">
          <div className="mx-auto flex max-w-6xl items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <LayoutDashboard className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">Dashboard - Laboratório 04</h1>
              <p className="text-lg text-indigo-100">Sprint 1: Caracterização do Dataset GitHub</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <KpiCard icon={Database} label="Total Repositórios" value={totalRepos.toLocaleString()} color="blue" />
            <KpiCard icon={Code2} label="Linguagens" value={String(totalLanguages)} color="indigo" />
            <KpiCard icon={Layers} label="Domínios" value={String(totalDomains)} color="purple" />
            <KpiCard icon={Star} label="Média Stars" value={`${(avgStars / 1000).toFixed(1)}k`} color="pink" />
            <KpiCard icon={GitFork} label="Média Forks" value={`${(avgForks / 1000).toFixed(1)}k`} color="orange" />
          </div>

          {/* Visualizations */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-1 gap-1 rounded-xl bg-white/70 p-1.5 shadow-sm ring-1 ring-black/5 backdrop-blur sm:grid-cols-4 mb-6">
              <TabsTrigger
                value="overview"
                className="gap-1.5 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <LayoutDashboard className="w-4 h-4" /> Visão Geral
              </TabsTrigger>
              <TabsTrigger
                value="languages"
                className="gap-1.5 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <Code2 className="w-4 h-4" /> Linguagens
              </TabsTrigger>
              <TabsTrigger
                value="domains"
                className="gap-1.5 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <Layers className="w-4 h-4" /> Domínios
              </TabsTrigger>
              <TabsTrigger
                value="analysis"
                className="gap-1.5 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <SlidersHorizontal className="w-4 h-4" /> Análise
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <Label className="mb-2 text-sm text-gray-700">Ano de criação</Label>
                  <MultiSelectFilter
                    label="Ano"
                    options={yearOptions}
                    selected={selectedYears}
                    onChange={setSelectedYears}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard icon={Database} label="Repositórios no período" value={overviewKpis.totalRepos.toLocaleString()} color="blue" />
                <KpiCard icon={Code2} label="Linguagens distintas" value={String(overviewKpis.totalLanguages)} color="indigo" />
                <KpiCard icon={Layers} label="Domínios distintos" value={String(overviewKpis.totalDomains)} color="purple" />
                <KpiCard icon={Star} label="Média de Stars" value={`${(overviewKpis.avgStars / 1000).toFixed(1)}k`} color="pink" />
              </div>

              <Card className={CARD_CLASS}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <BarChart3 className="w-4 h-4" />
                    </span>
                    Distribuição por Linguagem
                  </CardTitle>
                  <CardDescription>
                    Top 10 linguagens de programação {selectedYears.length > 0 ? 'nos anos selecionados' : 'no dataset'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={overviewLanguageCounts} layout="vertical" margin={{ left: 24 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis type="category" dataKey="name" width={100} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Bar dataKey="value" name="Repositórios" fill="#2563eb" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Languages Tab */}
            <TabsContent value="languages" className="space-y-6">
              <div>
                <Label className="mb-2 text-sm text-gray-700">Linguagens</Label>
                <MultiSelectFilter
                  label="Linguagens"
                  options={data.allLanguages}
                  selected={selectedLanguages}
                  onChange={setSelectedLanguages}
                />
                <p className="mt-2 text-xs text-gray-500">
                  {selectedLanguages.length > 0
                    ? `Mostrando ${selectedLanguages.length} linguagem(ns) selecionada(s).`
                    : 'Nenhuma selecionada: mostrando as 5 linguagens mais comuns por padrão.'}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className={CARD_CLASS}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                        <BarChart3 className="w-4 h-4" />
                      </span>
                      Stars Médias por Linguagem
                    </CardTitle>
                    <CardDescription>Média de stars dos repositórios de cada linguagem</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={starsByLanguageFiltered}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip contentStyle={TOOLTIP_STYLE} />
                        <Bar dataKey="value" name="Média de Stars" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className={CARD_CLASS}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">
                        <BarChart3 className="w-4 h-4" />
                      </span>
                      Forks Médios por Linguagem
                    </CardTitle>
                    <CardDescription>Média de forks dos repositórios de cada linguagem</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={forksByLanguageFiltered}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip contentStyle={TOOLTIP_STYLE} />
                        <Bar dataKey="value" name="Média de Forks" fill="#16a34a" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className={CARD_CLASS}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                        <LineChartIcon className="w-4 h-4" />
                      </span>
                      Evolução por Ano
                    </CardTitle>
                    <CardDescription>Repositórios criados por ano, por linguagem selecionada</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={languageEvolution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="year" />
                        <YAxis allowDecimals={false} />
                        <Tooltip contentStyle={TOOLTIP_STYLE} />
                        <Legend />
                        {activeLanguages.map((language, index) => (
                          <Line
                            key={language}
                            type="monotone"
                            dataKey={language}
                            name={language}
                            stroke={COLORS[index % COLORS.length]}
                            strokeWidth={2.5}
                            dot={false}
                            connectNulls
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className={CARD_CLASS}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
                        <BarChart3 className="w-4 h-4" />
                      </span>
                      Issues Abertas por Linguagem
                    </CardTitle>
                    <CardDescription>Média de issues abertas dos repositórios de cada linguagem</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={issuesByLanguageFiltered}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip contentStyle={TOOLTIP_STYLE} />
                        <Bar dataKey="value" name="Média de Issues" fill="#dc2626" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Domains Tab */}
            <TabsContent value="domains" className="space-y-6">
              <div>
                <Label className="mb-2 text-sm text-gray-700">Domínios</Label>
                <MultiSelectFilter
                  label="Domínios"
                  options={data.allDomains}
                  selected={selectedDomains}
                  onChange={setSelectedDomains}
                />
                <p className="mt-2 text-xs text-gray-500">
                  {selectedDomains.length > 0
                    ? `Mostrando ${selectedDomains.length} domínio(s) selecionado(s).`
                    : 'Nenhum selecionado: mostrando os 8 domínios mais comuns por padrão.'}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className={CARD_CLASS}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                        <BarChart3 className="w-4 h-4" />
                      </span>
                      Quantidade de Repositórios por Domínio
                    </CardTitle>
                    <CardDescription>Repositórios segmentados por domínios tecnológicos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={domainCountsFiltered}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" height={80} />
                        <YAxis allowDecimals={false} />
                        <Tooltip contentStyle={TOOLTIP_STYLE} />
                        <Bar dataKey="value" name="Repositórios" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className={CARD_CLASS}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                        <BarChart3 className="w-4 h-4" />
                      </span>
                      Stars Médias por Domínio
                    </CardTitle>
                    <CardDescription>Média de stars dos repositórios de cada domínio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={starsByDomainFiltered}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip contentStyle={TOOLTIP_STYLE} />
                        <Bar dataKey="value" name="Média de Stars" fill="#ea580c" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className={`${CARD_CLASS} lg:col-span-2`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                        <PieChartIcon className="w-4 h-4" />
                      </span>
                      Proprietário nos Domínios Selecionados
                    </CardTitle>
                    <CardDescription>Segmentação entre Organizações e Usuários nos domínios filtrados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Tooltip contentStyle={TOOLTIP_STYLE} />
                        <Legend />
                        <Pie data={ownerTypeInDomain} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                          {ownerTypeInDomain.map((entry, index) => (
                            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6">
              <Card className={CARD_CLASS}>
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-gray-900">Filtros de Pesquisa e Ordenação</CardTitle>
                  <CardDescription>
                    Busque por cards de análise e escolha a ordenação que melhor destaca as visualizações.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] items-end">
                    <div>
                      <Label htmlFor="search" className="mb-2 text-sm text-gray-700">
                        Pesquisa
                      </Label>
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="search"
                          value={searchQuery}
                          onChange={(event) => setSearchQuery(event.target.value)}
                          placeholder="Buscar por título ou descrição"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="sort" className="mb-2 text-sm text-gray-700">
                        Ordenação
                      </Label>
                      <Select value={sortOption} onValueChange={(value) => setSortOption(value as 'default' | 'alphabetical')}>
                        <SelectTrigger id="sort" className="w-full">
                          <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Ordem natural</SelectItem>
                          <SelectItem value="alphabetical">Alfabética</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAnalysisCards.length > 0 ? (
                  filteredAnalysisCards.map((card) => (
                    <Card className={CARD_CLASS} key={card.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                            <LineChartIcon className="w-4 h-4" />
                          </span>
                          {card.title}
                        </CardTitle>
                        <CardDescription>{card.description}</CardDescription>
                      </CardHeader>
                      <CardContent>{renderAnalysisChart(card.id)}</CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className={`${CARD_CLASS} col-span-full`}>
                    <CardHeader>
                      <CardTitle>Nenhum resultado encontrado</CardTitle>
                      <CardDescription>
                        Ajuste sua pesquisa ou ordenação para ver mais itens de análise.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer Info */}
          <Card className={`${CARD_CLASS} mt-12`}>
            <CardContent>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Sparkles className="h-5 w-5 text-indigo-500" />
                Sobre a Análise
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-900 mb-2">Dataset</p>
                  <p>3.000 repositórios do GitHub com as métricas mais populares e diversificadas da plataforma.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-2">Metodologia</p>
                  <p>Análise exploratória de dados com foco em caracterização, subgrupos e tendências temporais.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-2">Objetivo</p>
                  <p>Fornecer uma base sólida para as análises de Questões de Pesquisa na Sprint 2.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>Laboratório 04: Visualização de Dados | PUC Minas - Engenharia de Software</p>
        </div>
      </footer>
    </div>
  );
}
