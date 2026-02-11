'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CatalogCard } from '@/components/CatalogCard';
import { availabilityLabelMap, environmentLabelMap, flexibleLabelMap } from '@/lib/ui-labels';
import type { ProductItem } from '@/lib/types';

type SortMode = 'price_asc' | 'price_desc' | 'pitch_asc' | 'name_asc';

function parseList(value: string | null) {
  if (!value) return new Set<string>();
  return new Set(value.split(',').filter(Boolean));
}

function listToParam(values: Set<string>) {
  return Array.from(values).sort().join(',');
}

function translateFilterValue(group: string, value: string) {
  if (group === 'env') return environmentLabelMap[value as keyof typeof environmentLabelMap] ?? value;
  if (group === 'flex') return flexibleLabelMap[value as keyof typeof flexibleLabelMap] ?? value;
  if (group === 'availability') return availabilityLabelMap[value as keyof typeof availabilityLabelMap] ?? value;
  return value;
}

function FilterGroup({ title, values, selected, keyName, onChange }: { title: string; values: string[]; selected: Set<string>; keyName: string; onChange: (key: string, value: string, checked: boolean) => void }) {
  return (
    <fieldset className="rounded-xl border border-white/10 p-4">
      <legend className="px-1 text-sm text-slate-300">{title}</legend>
      <div className="mt-2 grid gap-2 text-sm">
        {values.map((value) => (
          <label key={value} className="inline-flex items-center gap-2 text-slate-200">
            <input type="checkbox" checked={selected.has(value)} onChange={(event) => onChange(keyName, value, event.target.checked)} />
            {translateFilterValue(keyName, value)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ProductsCatalog({ products }: { products: ProductItem[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedEnvironment = parseList(searchParams.get('env'));
  const selectedPitch = parseList(searchParams.get('pitch'));
  const selectedFlexible = parseList(searchParams.get('flex'));
  const selectedTech = parseList(searchParams.get('tech'));
  const selectedRefresh = parseList(searchParams.get('refresh'));
  const selectedSize = parseList(searchParams.get('size'));
  const selectedAvailability = parseList(searchParams.get('availability'));
  const selectedBadges = parseList(searchParams.get('badges'));
  const sortMode = (searchParams.get('sort') as SortMode | null) ?? 'name_asc';

  const facets = useMemo(() => ({
    pitch: Array.from(new Set(products.map((item) => String(item.pitch_mm)))).sort((a, b) => Number(a) - Number(b)),
    tech: Array.from(new Set(products.flatMap((item) => item.tech))).sort(),
    refresh: Array.from(new Set(products.map((item) => item.refresh_hz).filter((value): value is number => value !== null))).sort((a, b) => a - b).map(String),
    size: Array.from(new Set(products.map((item) => item.size_mm).filter((value): value is string => Boolean(value)))).sort(),
    badges: Array.from(new Set(products.flatMap((item) => item.badges))).sort()
  }), [products]);

  function setParamValue(key: string, value: string, checked: boolean) {
    const next = new URLSearchParams(searchParams.toString());
    const current = parseList(next.get(key));
    if (checked) current.add(value);
    else current.delete(value);

    const serialized = listToParam(current);
    if (serialized) next.set(key, serialized);
    else next.delete(key);

    router.replace(`${pathname}?${next.toString()}`);
  }

  function setSort(value: SortMode) {
    const next = new URLSearchParams(searchParams.toString());
    next.set('sort', value);
    router.replace(`${pathname}?${next.toString()}`);
  }

  function resetFilters() {
    router.replace(pathname);
  }

  const filtered = useMemo(() => {
    const results = products.filter((item) => {
      if (selectedEnvironment.size && !selectedEnvironment.has(item.environment)) return false;
      if (selectedPitch.size && !selectedPitch.has(String(item.pitch_mm))) return false;
      if (selectedFlexible.size && !selectedFlexible.has(item.is_flexible ? 'yes' : 'no')) return false;
      if (selectedTech.size && !item.tech.some((tech) => selectedTech.has(tech))) return false;
      if (selectedRefresh.size && !selectedRefresh.has(String(item.refresh_hz))) return false;
      if (selectedSize.size && !selectedSize.has(item.size_mm ?? '')) return false;
      if (selectedAvailability.size && !selectedAvailability.has(item.availability ?? '')) return false;
      if (selectedBadges.size && !item.badges.some((badge) => selectedBadges.has(badge))) return false;
      return true;
    });

    if (sortMode === 'price_asc') return results.sort((a, b) => (a.price_rub ?? Number.POSITIVE_INFINITY) - (b.price_rub ?? Number.POSITIVE_INFINITY));
    if (sortMode === 'price_desc') return results.sort((a, b) => (b.price_rub ?? Number.NEGATIVE_INFINITY) - (a.price_rub ?? Number.NEGATIVE_INFINITY));
    if (sortMode === 'pitch_asc') return results.sort((a, b) => a.pitch_mm - b.pitch_mm);
    return results.sort((a, b) => a.name.localeCompare(b.name, 'ru-RU'));
  }, [products, selectedEnvironment, selectedPitch, selectedFlexible, selectedTech, selectedRefresh, selectedSize, selectedAvailability, selectedBadges, sortMode]);

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-4">
        <FilterGroup title="Среда эксплуатации" values={['indoor', 'outdoor']} selected={selectedEnvironment} keyName="env" onChange={setParamValue} />
        <FilterGroup title="Шаг пикселя" values={facets.pitch} selected={selectedPitch} keyName="pitch" onChange={setParamValue} />
        <FilterGroup title="Исполнение" values={['yes', 'no']} selected={selectedFlexible} keyName="flex" onChange={setParamValue} />
        <FilterGroup title="Технология" values={facets.tech} selected={selectedTech} keyName="tech" onChange={setParamValue} />
        <FilterGroup title="Частота обновления" values={facets.refresh} selected={selectedRefresh} keyName="refresh" onChange={setParamValue} />
        <FilterGroup title="Размер" values={facets.size} selected={selectedSize} keyName="size" onChange={setParamValue} />
        <FilterGroup title="Наличие" values={['in_stock', 'preorder']} selected={selectedAvailability} keyName="availability" onChange={setParamValue} />
        <FilterGroup title="Метки" values={facets.badges} selected={selectedBadges} keyName="badges" onChange={setParamValue} />
        <button onClick={resetFilters} className="w-full rounded-xl border border-white/20 px-4 py-3 text-sm">Сбросить фильтры</button>
      </aside>
      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-300">Найдено: {filtered.length}</p>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <span>Сортировка</span>
            <select value={sortMode} onChange={(event) => setSort(event.target.value as SortMode)} className="rounded-lg border border-white/20 bg-slate-900 px-3 py-2 text-sm">
              <option value="pitch_asc">По шагу пикселя</option>
              <option value="price_asc">По цене: по возрастанию</option>
              <option value="price_desc">По цене: по убыванию</option>
              <option value="name_asc">По названию</option>
            </select>
          </label>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => <CatalogCard key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
}
