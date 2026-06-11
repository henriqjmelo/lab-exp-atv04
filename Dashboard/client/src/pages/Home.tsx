import { useState } from 'react';
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
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Search } from 'lucide-react';
import { useRepoData } from '@/hooks/useRepoData';

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#0891b2', '#ca8a04', '#4f46e5', '#dc2626', '#0d9488'];

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

export default function Home() {
  const data = useRepoData();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'default' | 'alphabetical'>('default');

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

  function renderAnalysisChart(id: string) {
    switch (id) {
      case 'evolucao':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.reposByYear}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="repos" name="Repositórios" stroke="#2563eb" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'stars':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.starsByLanguage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgStars" name="Média de Stars" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'correlacao':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="stars" name="Stars" />
              <YAxis type="number" dataKey="forks" name="Forks" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value: number) => value.toLocaleString()} />
              <Scatter data={data.starsVsForks} fill="#db2777" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      case 'owner':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.ownerVsStars}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgStars" name="Média de Stars" fill="#ea580c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard - Laboratório 04</h1>
            <p className="text-lg text-gray-600">Sprint 1: Caracterização do Dataset GitHub</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Repositórios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{totalRepos.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Linguagens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo-600">{totalLanguages}</div>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Domínios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{totalDomains}</div>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Média Stars</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-pink-600">{(avgStars / 1000).toFixed(1)}k</div>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Média Forks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{(avgForks / 1000).toFixed(1)}k</div>
              </CardContent>
            </Card>
          </div>

          {/* Visualizations */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="languages">Linguagens</TabsTrigger>
              <TabsTrigger value="domains">Domínios</TabsTrigger>
              <TabsTrigger value="analysis">Análise</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Distribuição por Linguagem
                  </CardTitle>
                  <CardDescription>Top 10 linguagens de programação no dataset</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data.languageCounts} layout="vertical" margin={{ left: 24 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis type="category" dataKey="name" width={100} />
                      <Tooltip />
                      <Bar dataKey="value" name="Repositórios" fill="#2563eb" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Languages Tab */}
            <TabsContent value="languages" className="space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Distribuição por Domínio
                  </CardTitle>
                  <CardDescription>Repositórios segmentados por domínios tecnológicos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data.domainCounts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" height={80} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" name="Repositórios" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Domains Tab */}
            <TabsContent value="domains" className="space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5" />
                    Distribuição por Proprietário
                  </CardTitle>
                  <CardDescription>Segmentação entre Organizações e Usuários</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Tooltip />
                      <Legend />
                      <Pie data={data.ownerTypeCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                        {data.ownerTypeCounts.map((entry, index) => (
                          <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6">
              <Card className="bg-white border border-gray-200 shadow-sm">
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
                    <Card className="bg-white" key={card.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <LineChartIcon className="w-5 h-5" />
                          {card.title}
                        </CardTitle>
                        <CardDescription>{card.description}</CardDescription>
                      </CardHeader>
                      <CardContent>{renderAnalysisChart(card.id)}</CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="bg-white col-span-full">
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
          <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sobre a Análise</h3>
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
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>Laboratório 04: Visualização de Dados | PUC Minas - Engenharia de Software</p>
        </div>
      </footer>
    </div>
  );
}
