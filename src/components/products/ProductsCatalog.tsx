'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { CatalogCard } from '@/components/CatalogCard';
import type { ProductItem } from '@/lib/types';

type SortMode = 'price_asc' | 'price_desc' | 'pitch_asc' | 'name_asc';

type CatalogQueryState = {
  env: Set<string>;
  pitch: Set<string>;
  flex: Set<string>;
  tech: Set<string>;
  refresh: Set<string>;
  size: Set<string>;
  availability: Set<string>;
  badges: Set<string>;
  sort: SortMode;
};

function parseList(value: string | null) {
  if (!value) return new Set<string>();
  return new Set(value.split(',').filter(Boolean));
}

function listToParam(values: Set<string>) {
  return Array.from(values).sort().join(',');
}

function parseQueryState(searchParams: URLSearchParams): CatalogQueryState {
  const sortParam = searchParams.get('sort');
  const sort: SortMode = sortParam === 'price_asc' || sortParam === 'price_desc' || sortParam === 'pitch_asc' || sortParam === 'name_asc' ? sortParam : 'name_asc';

  return {
    env: parseList(searchParams.get('env')),
    pitch: parseList(searchParams.get('pitch')),
    flex: parseList(searchParams.get('flex')),
    tech: parseList(searchParams.get('tech')),
    refresh: parseList(searchParams.get('refresh')),
    size: parseList(searchParams.get('size')),
    availability: parseList(searchParams.get('availability')),
    badges: parseList(searchParams.get('badges')),
    sort,
  };
}

function buildQueryString(state: CatalogQueryState) {
  const next = new URLSearchParams();

  const mappings: Array<[keyof Omit<CatalogQueryState, 'sort'>, string]> = [
    ['env', 'env'],
    ['pitch', 'pitch'],
    ['flex', 'flex'],
    ['tech', 'tech'],
    ['refresh', 'refresh'],
    ['size', 'size'],
    ['availability', 'availability'],
    ['badges', 'badges'],
  ];

  mappings.forEach(([key, queryKey]) => {
    const serialized = listToParam(state[key]);
    if (serialized) next.set(queryKey, serialized);
  });

  if (state.sort !== 'name_asc') {
    next.set('sort', state.sort);
  }

  return next.toString();
}

function FilterGroup({ title, values, selected, keyName, onChange }: { title: string; values: string[]; selected: Set<string>; keyName: string; onChange: (key: keyof Omit<CatalogQueryState, 'sort'>, value: string, checked: boolean) => void }) {
  return (
    <fieldset className="rounded-xl border border-white/10 p-4">
      <legend className="px-1 text-sm text-slate-300">{title}</legend>
      <div className="mt-2 grid gap-2 text-sm">
        {values.map((value) => (
          <label key={value} className="inline-flex items-center gap-2 text-slate-200">
            <input type="checkbox" checked={selected.has(value)} onChange={(event) => onChange(keyName, value, event.target.checked)} />
            {value}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ProductsCatalog({ products, initialSearchParams = '' }: { products: ProductItem[]; initialSearchParams?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [queryState, setQueryState] = useState<CatalogQueryState>(() => parseQueryState(new URLSearchParams(initialSearchParams)));

  const facets = useMemo(() => ({
    pitch: Array.from(new Set(products.map((item) => String(item.pitch_mm)))).sort((a, b) => Number(a) - Number(b)),
    tech: Array.from(new Set(products.flatMap((item) => item.tech))).sort(),
    refresh: Array.from(new Set(products.map((item) => item.refresh_hz).filter((value): value is number => value !== null))).sort((a, b) => a - b).map(String),
    size: Array.from(new Set(products.map((item) => item.size_mm).filter((value): value is string => Boolean(value)))).sort(),
    badges: Array.from(new Set(products.flatMap((item) => item.badges))).sort()
  }), [products]);

  function syncUrl(nextState: CatalogQueryState) {
    const queryString = buildQueryString(nextState);
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  }

  function setParamValue(key: keyof Omit<CatalogQueryState, 'sort'>, value: string, checked: boolean) {
    setQueryState((prev) => {
      const nextSet = new Set(prev[key]);
      if (checked) nextSet.add(value);
      else nextSet.delete(value);

      const nextState = {
        ...prev,
        [key]: nextSet,
      };

      syncUrl(nextState);
      return nextState;
    });
  }

  function setSort(value: SortMode) {
    setQueryState((prev) => {
      const nextState = { ...prev, sort: value };
      syncUrl(nextState);
      return nextState;
    });
  }

  function resetFilters() {
    const nextState = parseQueryState(new URLSearchParams());
    setQueryState(nextState);
    router.replace(pathname);
  }

  const filtered = useMemo(() => {
    const results = products.filter((item) => {
      if (queryState.env.size && !queryState.env.has(item.environment)) return false;
      if (queryState.pitch.size && !queryState.pitch.has(String(item.pitch_mm))) return false;
      if (queryState.flex.size && !queryState.flex.has(item.is_flexible ? 'yes' : 'no')) return false;
      if (queryState.tech.size && !item.tech.some((tech) => queryState.tech.has(tech))) return false;
      if (queryState.refresh.size && !queryState.refresh.has(String(item.refresh_hz))) return false;
      if (queryState.size.size && !queryState.size.has(item.size_mm ?? '')) return false;
      if (queryState.availability.size && !queryState.availability.has(item.availability ?? '')) return false;
      if (queryState.badges.size && !item.badges.some((badge) => queryState.badges.has(badge))) return false;
      return true;
    });

    if (queryState.sort === 'price_asc') return results.sort((a, b) => (a.price_rub ?? Number.POSITIVE_INFINITY) - (b.price_rub ?? Number.POSITIVE_INFINITY));
    if (queryState.sort === 'price_desc') return results.sort((a, b) => (b.price_rub ?? Number.NEGATIVE_INFINITY) - (a.price_rub ?? Number.NEGATIVE_INFINITY));
    if (queryState.sort === 'pitch_asc') return results.sort((a, b) => a.pitch_mm - b.pitch_mm);
    return results.sort((a, b) => a.name.localeCompare(b.name, 'ru-RU'));
  }, [products, queryState]);

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-4">
        <FilterGroup title="Environment" values={['indoor', 'outdoor']} selected={queryState.env} keyName="env" onChange={setParamValue} />
        <FilterGroup title="Шаг пикселя" values={facets.pitch} selected={queryState.pitch} keyName="pitch" onChange={setParamValue} />
        <FilterGroup title="Flexible" values={['yes', 'no']} selected={queryState.flex} keyName="flex" onChange={setParamValue} />
        <FilterGroup title="Technology" values={facets.tech} selected={queryState.tech} keyName="tech" onChange={setParamValue} />
        <FilterGroup title="Refresh rate" values={facets.refresh} selected={queryState.refresh} keyName="refresh" onChange={setParamValue} />
        <FilterGroup title="Size" values={facets.size} selected={queryState.size} keyName="size" onChange={setParamValue} />
        <FilterGroup title="Availability" values={['in_stock', 'preorder']} selected={queryState.availability} keyName="availability" onChange={setParamValue} />
        <FilterGroup title="Badges" values={facets.badges} selected={queryState.badges} keyName="badges" onChange={setParamValue} />
        <button onClick={resetFilters} className="w-full rounded-xl border border-white/20 px-4 py-3 text-sm">Сбросить фильтры</button>
      </aside>
      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-300">Найдено: {filtered.length}</p>
          <select value={queryState.sort} onChange={(event) => setSort(event.target.value as SortMode)} className="rounded-lg border border-white/20 bg-slate-900 px-3 py-2 text-sm">
            <option value="name_asc">По названию</option>
            <option value="pitch_asc">По шагу пикселя</option>
            <option value="price_asc">Цена: по возрастанию</option>
            <option value="price_desc">Цена: по убыванию</option>
          </select>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => <CatalogCard key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
}
