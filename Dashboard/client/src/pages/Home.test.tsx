import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import Home from './Home';

const CSV = `Domain,Repository Name,Full Name,Description,Primary Language,Stars Count,Forks Count,Watchers Count,Open Issues Count,Has Wiki,Has Pages,Has Projects,Size (KB),Created At,Updated At,Pushed At,Default Branch,Owner Login,Owner Type,License,Topics
Web,Repo1,a/Repo1,d,Python,100,10,0,5,true,true,true,10,2015-01-01T00:00:00Z,2015-01-01T00:00:00Z,2015-01-01T00:00:00Z,main,a,Organization,MIT,
Web,Repo2,b/Repo2,d,JavaScript,200,20,0,8,true,true,true,10,2018-01-01T00:00:00Z,2018-01-01T00:00:00Z,2018-01-01T00:00:00Z,main,b,User,MIT,
Data,Repo3,c/Repo3,d,Python,300,30,0,2,true,true,true,10,2018-01-01T00:00:00Z,2018-01-01T00:00:00Z,2018-01-01T00:00:00Z,main,c,Organization,MIT,
Data,Repo4,d/Repo4,d,JavaScript,50,5,0,1,true,true,true,10,2020-01-01T00:00:00Z,2020-01-01T00:00:00Z,2020-01-01T00:00:00Z,main,d,User,MIT,
`;

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ text: () => Promise.resolve(CSV) })
  );
});

function getCardByTitle(title: string) {
  const heading = screen.getByText(title);
  const card = heading.closest('[data-slot="card"]');
  if (!card) throw new Error(`Card not found for title: ${title}`);
  return card as HTMLElement;
}

function kpiValue(label: string) {
  const heading = screen.getByText(label);
  const card = heading.closest('[data-slot="card"]') as HTMLElement;
  return card.querySelector('.text-2xl')?.textContent ?? '';
}

function barCount(card: HTMLElement) {
  return card.querySelectorAll('.recharts-rectangle').length;
}

describe('Home filters', () => {
  it('Linguagens: filtering to a single language leaves only one bar in each chart', async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByRole('tab', { name: 'Linguagens' }));

    const starsCard = getCardByTitle('Stars Médias por Linguagem');
    await waitFor(() => expect(barCount(starsCard)).toBe(2));

    await user.click(screen.getByRole('button', { name: /filtrar por linguagens/i }));
    await user.click(screen.getByRole('option', { name: 'Python' }));
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(barCount(getCardByTitle('Stars Médias por Linguagem'))).toBe(1);
      expect(barCount(getCardByTitle('Forks Médios por Linguagem'))).toBe(1);
    });
  });

  it('Domínios: filtering to a single domain leaves only one bar in each chart', async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByRole('tab', { name: 'Domínios' }));

    const countCard = getCardByTitle('Quantidade de Repositórios por Domínio');
    await waitFor(() => expect(barCount(countCard)).toBe(2));

    await user.click(screen.getByRole('button', { name: /filtrar por domínios/i }));
    await user.click(screen.getByRole('option', { name: 'Data' }));
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(barCount(getCardByTitle('Quantidade de Repositórios por Domínio'))).toBe(1);
      expect(barCount(getCardByTitle('Stars Médias por Domínio'))).toBe(1);
    });
  });

  it('Visão Geral: filtering by year changes the repository count KPI', async () => {
    const user = userEvent.setup();
    render(<Home />);

    await waitFor(() => expect(kpiValue('Repositórios no período')).toBe('4'));

    await user.click(screen.getByRole('button', { name: /filtrar por ano/i }));
    await user.click(screen.getByText('2018'));
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(kpiValue('Repositórios no período')).toBe('2');
    });
  });
});
