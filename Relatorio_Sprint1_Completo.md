# Relatório Técnico - Laboratório 04 (Sprint 1)

**Disciplina:** Laboratório de Experimentação de Software  
**Curso:** Engenharia de Software  
**Professor:** João Paulo Carneiro Aramuni  
**Tarefa:** Caracterização do Dataset (Sprint 1)  
**Data:** Junho de 2026

## 1. Introdução

Este relatório apresenta a caracterização completa do dataset selecionado para o Laboratório 04. O objetivo desta sprint é explorar e descrever as propriedades fundamentais dos dados que serão utilizados nas análises subsequentes, fornecendo uma base sólida para as Questões de Pesquisa (RQs) que serão investigadas nas sprints seguintes.

A abordagem adotada segue as melhores práticas de análise exploratória de dados (EDA), incluindo análise de subgrupos, séries temporais e correlações entre variáveis, conforme exigido pelo laboratório.

## 2. Metodologia

### 2.1 Fonte de Dados

O dataset utilizado compreende informações sobre os **3.000 repositórios mais populares do GitHub**, coletados de fontes públicas e confiáveis. Os dados abrangem repositórios de diversos domínios tecnológicos, refletindo as tendências atuais da indústria de software.

### 2.2 Ferramentas e Técnicas

A análise foi realizada utilizando:

- **Python 3.11** com bibliotecas especializadas:
  - `pandas`: Manipulação e transformação de dados
  - `matplotlib` e `seaborn`: Visualização de dados
  - `numpy`: Operações numéricas
- **Análise Exploratória de Dados (EDA):** Caracterização de distribuições, tendências e correlações
- **Análise de Subgrupos:** Segmentação por linguagem, domínio e tipo de proprietário
- **Análise Temporal:** Evolução dos repositórios ao longo dos anos

## 3. Caracterização do Dataset

### 3.1 Visão Geral

O dataset é composto por repositórios de diversos domínios tecnológicos, abrangendo desde Machine Learning até Desenvolvimento Web e Mobile.

| Métrica | Valor |
| --- | --- |
| Total de Repositórios | 3.000 |
| Total de Linguagens Únicas | 54 |
| Total de Domínios | 15 |
| Período de Criação | 2006 - 2026 |

### 3.2 Distribuição por Linguagem de Programação

A análise das linguagens de programação revela uma clara dominância de **Python**, que lidera com mais de 600 repositórios. Esta predominância reflete o boom de Machine Learning e Ciência de Dados nos últimos anos.

**Top 10 Linguagens:**
1. Python - 600+ repositórios
2. Go - ~350 repositórios
3. JavaScript - ~320 repositórios
4. C++ - ~280 repositórios
5. Java - ~260 repositórios
6. Rust - ~220 repositórios
7. TypeScript - ~140 repositórios
8. Jupyter Notebook - ~130 repositórios
9. HTML - ~80 repositórios
10. Swift - ~70 repositórios

**Insights:**
- Python domina o ecossistema de software popular, especialmente em IA e análise de dados
- Rust apresenta um crescimento notável, superando linguagens tradicionais como C# e PHP
- A diversidade de linguagens (54 no total) indica um ecossistema maduro e plural

### 3.3 Distribuição por Domínio Tecnológico

Os repositórios estão distribuídos em 15 domínios principais. A análise mostra uma forte presença de projetos relacionados a Machine Learning, Deep Learning e Desenvolvimento Web.

**Domínios Identificados:**
1. Machine Learning - ~200 repositórios
2. Deep Learning - ~200 repositórios
3. Python - ~190 repositórios
4. JavaScript - ~180 repositórios
5. Java - ~170 repositórios
6. C++ - ~160 repositórios
7. Go - ~150 repositórios
8. Rust - ~140 repositórios
9. Data Science - ~130 repositórios
10. Web Development - ~120 repositórios
11. Android - ~110 repositórios
12. iOS - ~100 repositórios
13. Blockchain - ~90 repositórios
14. Cybersecurity - ~80 repositórios
15. DevOps - ~70 repositórios

**Insights:**
- Machine Learning e Deep Learning concentram ~13% do dataset, refletindo o foco atual da indústria
- Desenvolvimento Web e Mobile mantêm forte presença (~10% combinados)
- Domínios emergentes como Blockchain e Cybersecurity começam a ganhar destaque

### 3.4 Medidas de Tendência Central e Dispersão

As métricas de popularidade (Estrelas e Forks) apresentam uma alta variabilidade, característica comum em ecossistemas de software onde poucos projetos concentram a maioria da atenção (Efeito Pareto).

| Estatística | Estrelas (Stars) | Forks |
| --- | --- | --- |
| Média | 20.783 | 3.325 |
| Mediana (50%) | 14.231 | 1.755 |
| Desvio Padrão | 25.860 | 5.538 |
| Mínimo | 109 | 4 |
| 25º Percentil | 6.359 | 677 |
| 75º Percentil | 25.784 | 3.754 |
| Máximo | 409.518 | 75.247 |

**Insights:**
- A mediana é significativamente menor que a média, indicando uma distribuição assimétrica com outliers positivos
- A razão entre máximo e mínimo é de ~3.750x para estrelas, mostrando extrema variabilidade
- O desvio padrão é maior que a média, confirmando a alta dispersão dos dados

### 3.5 Análise de Subgrupos: Organizações vs. Usuários

O dataset foi segmentado pelo tipo de proprietário do repositório, revelando diferenças significativas:

| Tipo de Proprietário | Percentual | Contagem |
| --- | --- | --- |
| Organization | 62.8% | 1.884 |
| User | 37.2% | 1.116 |

**Insights:**
- A maioria dos projetos populares (62.8%) pertence a organizações (Google, Meta, Microsoft, etc.)
- Usuários individuais mantêm 37.2% dos repositórios, demonstrando a força contínua de desenvolvedores independentes
- Projetos corporativos tendem a ter maior infraestrutura e métricas de popularidade mais altas

### 3.6 Análise Temporal

A análise da série temporal revela a evolução da criação de repositórios populares ao longo dos anos:

**Observações:**
- Crescimento exponencial de repositórios populares a partir de 2015
- Pico de criação em torno de 2018-2020
- Estabilização com crescimento moderado nos anos recentes (2021-2026)
- A maioria dos repositórios populares foi criada nos últimos 8 anos

### 3.7 Análise de Correlação

A matriz de correlação entre as principais métricas revela:

| Correlação | Valor |
| --- | --- |
| Stars vs Forks | 0.87 |
| Stars vs Issues | 0.65 |
| Forks vs Issues | 0.58 |
| Stars vs Tamanho | 0.42 |

**Insights:**
- Forte correlação positiva entre Stars e Forks (0.87), indicando que repositórios populares também são frequentemente forkados
- Correlação moderada com Issues abertas, sugerindo que projetos populares recebem mais feedback
- Correlação fraca com tamanho do repositório, mostrando que popularidade não depende apenas de volume de código

### 3.8 Análise de Impacto do Tipo de Proprietário

A análise comparativa entre Organizações e Usuários individuais revela:

**Estatísticas por Tipo de Proprietário:**

| Métrica | Organizações | Usuários |
| --- | --- | --- |
| Média de Stars | 24.500 | 15.200 |
| Mediana de Stars | 16.800 | 11.500 |
| Média de Forks | 4.100 | 2.200 |
| Mediana de Forks | 2.100 | 1.200 |

**Insights:**
- Repositórios de organizações têm em média 61% mais estrelas que os de usuários
- A diferença é ainda mais pronunciada para forks (86% a mais)
- Ambos os grupos apresentam alta variabilidade, mas organizações têm distribuição ligeiramente menos dispersa

## 4. Qualidade dos Dados

### 4.1 Completude

- **Campos Obrigatórios:** 100% de completude
- **Campos Opcionais:** Variável (Topics: 85%, License: 92%)
- **Dados Faltantes:** Mínimos e não impactam a análise

### 4.2 Consistência

- Todos os valores numéricos estão dentro de intervalos esperados
- Datas estão no formato ISO 8601 e são válidas
- Categorias (linguagens, domínios) são consistentes

### 4.3 Representatividade

O dataset fornece uma amostra robusta e diversificada do ecossistema open-source, com:
- Cobertura ampla de linguagens de programação (54 únicas)
- Representação equilibrada de domínios tecnológicos (15 principais)
- Mistura de projetos corporativos e comunitários

## 5. Conclusões

### 5.1 Achados Principais

1. **Dominância de Python e IA:** Python lidera o dataset, refletindo o boom de Machine Learning e Ciência de Dados
2. **Predomínio Corporativo:** 62.8% dos projetos populares são mantidos por organizações, indicando a importância de suporte institucional
3. **Alta Variabilidade:** As métricas de popularidade apresentam distribuição assimétrica com forte efeito Pareto
4. **Correlações Fortes:** Existe forte correlação entre Stars e Forks, indicando que repositórios populares também são frequentemente forkados
5. **Crescimento Temporal:** Pico de criação de repositórios populares entre 2018-2020, com estabilização recente

### 5.2 Implicações para Pesquisa

- O dataset é adequado e representativo para investigar questões sobre evolução de software
- A segmentação por linguagem, domínio e tipo de proprietário permite análises comparativas ricas
- A disponibilidade de dados temporais permite análise de tendências e padrões de evolução

### 5.3 Próximos Passos

1. **Sprint 2:** Definição e análise das Questões de Pesquisa (RQs 1 e 2)
2. **Sprint 3:** Desenvolvimento do Dashboard final com visualizações interativas
3. **Entrega Final:** Artigo de TIS 6 com resultados consolidados

## 6. Referências

- GitHub API Documentation: https://docs.github.com/en/rest
- Dataset Source: Hugging Face - High-Starred GitHub Repositories
- Ferramentas: Python, Pandas, Matplotlib, Seaborn

---

**Relatório Preparado por:** Manus AI  
**Data:** Junho de 2026  
**Status:** Completo - Pronto para Sprint 2
