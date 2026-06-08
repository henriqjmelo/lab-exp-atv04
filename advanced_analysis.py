import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# Configurações de estilo
sns.set_theme(style="whitegrid")
plt.rcParams['figure.figsize'] = (12, 8)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_CSV = os.path.join(BASE_DIR, 'github_top_repositories.csv')
OUTPUT = lambda filename: os.path.join(BASE_DIR, filename)

# Carregar o dataset
df = pd.read_csv(INPUT_CSV)

# Converter datas
df['Created At'] = pd.to_datetime(df['Created At'])
df['Year'] = df['Created At'].dt.year

# 1. Análise por Ano de Criação (Série Temporal)
plt.figure(figsize=(12, 6))
yearly_counts = df.groupby('Year').size()
sns.lineplot(x=yearly_counts.index, y=yearly_counts.values, marker='o', color='#F06292')
plt.title('Evolução da Criação de Repositórios Populares por Ano', fontsize=15)
plt.xlabel('Ano')
plt.ylabel('Número de Repositórios')
plt.tight_layout()
plt.savefig(OUTPUT('evolucao_temporal.png'))
plt.close()

# 2. Análise Comparativa de Subgrupos (Linguagens x Stars)
top_5_langs = df['Primary Language'].value_counts().head(5).index
df_top_langs = df[df['Primary Language'].isin(top_5_langs)]

plt.figure(figsize=(12, 6))
sns.boxplot(data=df_top_langs, x='Primary Language', y='Stars Count', palette='viridis')
plt.yscale('log')
plt.title('Distribuição de Estrelas por Linguagem (Top 5)', fontsize=15)
plt.xlabel('Linguagem')
plt.ylabel('Estrelas (Escala Log)')
plt.tight_layout()
plt.savefig(OUTPUT('stars_por_linguagem.png'))
plt.close()

# 3. Análise de Correlação (Stars vs Forks vs Issues)
correlation = df[['Stars Count', 'Forks Count', 'Open Issues Count', 'Size (KB)']].corr()
plt.figure(figsize=(10, 8))
sns.heatmap(correlation, annot=True, cmap='coolwarm', fmt='.2f')
plt.title('Matriz de Correlação entre Métricas', fontsize=15)
plt.tight_layout()
plt.savefig(OUTPUT('correlacao_metricas.png'))
plt.close()

# 4. Análise de Subgrupos: Owner Type x Stars
plt.figure(figsize=(10, 6))
sns.violinplot(data=df, x='Owner Type', y='Stars Count', palette='magma')
plt.yscale('log')
plt.title('Impacto do Tipo de Proprietário na Popularidade', fontsize=15)
plt.xlabel('Tipo de Proprietário')
plt.ylabel('Estrelas (Escala Log)')
plt.tight_layout()
plt.savefig(OUTPUT('owner_vs_stars.png'))
plt.close()

# 5. Estatísticas por Linguagem para o Dashboard
lang_stats = df.groupby('Primary Language').agg({
    'Stars Count': ['mean', 'median', 'count'],
    'Forks Count': ['mean', 'median']
}).reset_index()
lang_stats.columns = ['Language', 'Stars_Mean', 'Stars_Median', 'Repo_Count', 'Forks_Mean', 'Forks_Median']
lang_stats.to_json(OUTPUT('lang_stats.json'), orient='records')

print("Análise avançada concluída e arquivos gerados.")
