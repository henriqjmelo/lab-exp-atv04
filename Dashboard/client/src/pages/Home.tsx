import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart } from 'lucide-react';

interface DatasetStats {
  totalRepos: number;
  totalLanguages: number;
  totalDomains: number;
  avgStars: number;
  avgForks: number;
}

export default function Home() {
  const [stats, setStats] = useState<DatasetStats>({
    totalRepos: 3000,
    totalLanguages: 54,
    totalDomains: 15,
    avgStars: 20783,
    avgForks: 3325,
  });

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
                <div className="text-3xl font-bold text-blue-600">{stats.totalRepos.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Linguagens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo-600">{stats.totalLanguages}</div>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Domínios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{stats.totalDomains}</div>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Média Stars</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-pink-600">{(stats.avgStars / 1000).toFixed(1)}k</div>
              </CardContent>
            </Card>

            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Média Forks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{(stats.avgForks / 1000).toFixed(1)}k</div>
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
                    <BarChart className="w-5 h-5" />
                    Distribuição por Linguagem
                  </CardTitle>
                  <CardDescription>Top 10 linguagens de programação no dataset</CardDescription>
                </CardHeader>
                <CardContent>
                  <img src="/distribuicao_linguagens.png" alt="Distribuição por Linguagem" className="w-full rounded-lg" />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Languages Tab */}
            <TabsContent value="languages" className="space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="w-5 h-5" />
                    Distribuição por Domínio
                  </CardTitle>
                  <CardDescription>Repositórios segmentados por domínios tecnológicos</CardDescription>
                </CardHeader>
                <CardContent>
                  <img src="/distribuicao_dominios.png" alt="Distribuição por Domínio" className="w-full rounded-lg" />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Domains Tab */}
            <TabsContent value="domains" className="space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Distribuição por Proprietário
                  </CardTitle>
                  <CardDescription>Segmentação entre Organizações e Usuários</CardDescription>
                </CardHeader>
                <CardContent>
                  <img src="/distribuicao_owner.png" alt="Distribuição por Proprietário" className="w-full rounded-lg" />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="w-5 h-5" />
                      Evolução Temporal
                    </CardTitle>
                    <CardDescription>Criação de repositórios por ano</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img src="/evolucao_temporal.png" alt="Evolução Temporal" className="w-full rounded-lg" />
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart className="w-5 h-5" />
                      Stars por Linguagem
                    </CardTitle>
                    <CardDescription>Distribuição de popularidade (Top 5)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img src="/stars_por_linguagem.png" alt="Stars por Linguagem" className="w-full rounded-lg" />
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle>Correlação de Métricas</CardTitle>
                    <CardDescription>Análise de correlação entre variáveis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img src="/correlacao_metricas.png" alt="Correlação de Métricas" className="w-full rounded-lg" />
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle>Impacto do Proprietário</CardTitle>
                    <CardDescription>Influência do tipo de proprietário na popularidade</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img src="/owner_vs_stars.png" alt="Owner vs Stars" className="w-full rounded-lg" />
                  </CardContent>
                </Card>
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
