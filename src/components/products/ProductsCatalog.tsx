'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CatalogCard } from '@/components/CatalogCard';
import { availabilityLabelMap, environmentLabelMap, flexibleLabelMap } from '@/lib/ui-labels';
import type { DisplayProductItem, ModuleProductItem } from '@/lib/types';

type SortMode = 'price_asc' | 'price_desc' | 'pitch_asc' | 'name_asc';
type CatalogType = 'modules' | 'displays';

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
  if (group === 'series' && value === 'SCA All-in-One') return 'SCA All-in-One';
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

function CatalogTypeSelector({ selected, onSelect }: { selected: CatalogType; onSelect: (value: CatalogType) => void }) {
  return (
    <div className="inline-flex w-full flex-col rounded-xl border border-white/15 bg-slate-900/70 p-1 sm:w-auto sm:flex-row">
      <button onClick={() => onSelect('modules')} className={`rounded-lg px-3 py-2 text-left text-sm transition sm:text-center ${selected === 'modules' ? 'bg-cyan-300 text-slate-900' : 'text-slate-300 hover:text-white'}`}>
        LED модули (Meiyad)
      </button>
      <button onClick={() => onSelect('displays')} className={`rounded-lg px-3 py-2 text-left text-sm transition sm:text-center ${selected === 'displays' ? 'bg-cyan-300 text-slate-900' : 'text-slate-300 hover:text-white'}`}>
        LED экраны SAPPHIRE (SCIH/SCA)
      </button>
    </div>
  );
}

export function ProductsCatalog({ modules, displays }: { modules: ModuleProductItem[]; displays: DisplayProductItem[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const catalogType = (searchParams.get('type') as CatalogType | null) ?? 'modules';

  const selectedEnvironment = parseList(searchParams.get('env'));
  const selectedPitch = parseList(searchParams.get('pitch'));
  const selectedFlexible = parseList(searchParams.get('flex'));
  const selectedTech = parseList(searchParams.get('tech'));
  const selectedRefresh = parseList(searchParams.get('refresh'));
  const selectedSize = parseList(searchParams.get('size'));
  const selectedAvailability = parseList(searchParams.get('availability'));
  const selectedBadges = parseList(searchParams.get('badges'));

  const selectedSeries = parseList(searchParams.get('series'));
  const selectedPixelType = parseList(searchParams.get('pixel_type'));
  const selectedViewAngle = parseList(searchParams.get('view_angle'));
  const selectedBrightness = parseList(searchParams.get('brightness'));
  const selectedIp = parseList(searchParams.get('ip'));
  const selectedScreenResolution = parseList(searchParams.get('screen_resolution'));

  const sortMode = (searchParams.get('sort') as SortMode | null) ?? 'name_asc';
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const moduleFacets = useMemo(() => ({
    pitch: Array.from(new Set(modules.map((item) => String(item.pitch_mm)))).sort((a, b) => Number(a) - Number(b)),
    tech: Array.from(new Set(modules.flatMap((item) => item.tech))).sort(),
    refresh: Array.from(new Set(modules.map((item) => item.refresh_hz).filter((value): value is number => value !== null))).sort((a, b) => a - b).map(String),
    size: Array.from(new Set(modules.map((item) => item.size_mm).filter((value): value is string => Boolean(value)))).sort(),
    badges: Array.from(new Set(modules.flatMap((item) => item.badges))).sort()
  }), [modules]);

  const displayFacets = useMemo(() => ({
    series: Array.from(new Set(displays.map((item) => item.series))).sort(),
    pitch: Array.from(new Set(displays.map((item) => String(item.pitch_mm)))).sort((a, b) => Number(a) - Number(b)),
    pixelType: Array.from(new Set(displays.map((item) => item.pixel_type))).sort(),
    viewAngles: Array.from(new Set(displays.map((item) => item.view_angle_h))).sort(),
    brightness: Array.from(new Set(displays.map((item) => item.brightness_nits).filter((value): value is string => Boolean(value)))).sort(),
    ip: Array.from(new Set(displays.map((item) => item.ip_rating))).sort(),
    screenResolution: Array.from(new Set(displays.map((item) => item.screen_resolution).filter((value): value is 'UHD' | 'FHD' => Boolean(value)))).sort()
  }), [displays]);

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

  function setCatalogType(nextType: CatalogType) {
    const next = new URLSearchParams(searchParams.toString());
    next.set('type', nextType);
    ['env', 'pitch', 'flex', 'tech', 'refresh', 'size', 'availability', 'badges', 'series', 'pixel_type', 'view_angle', 'brightness', 'ip', 'screen_resolution'].forEach((key) => next.delete(key));
    router.replace(`${pathname}?${next.toString()}`);
  }

  function resetFilters() {
    const next = new URLSearchParams();
    next.set('type', catalogType);
    router.replace(`${pathname}?${next.toString()}`);
  }

  const filteredModules = useMemo(() => {
    const results = modules.filter((item) => {
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
  }, [modules, selectedEnvironment, selectedPitch, selectedFlexible, selectedTech, selectedRefresh, selectedSize, selectedAvailability, selectedBadges, sortMode]);

  const filteredDisplays = useMemo(() => {
    const results = displays.filter((item) => {
      if (selectedSeries.size && !selectedSeries.has(item.series)) return false;
      if (selectedPitch.size && !selectedPitch.has(String(item.pitch_mm))) return false;
      if (selectedPixelType.size && !selectedPixelType.has(item.pixel_type)) return false;
      if (selectedViewAngle.size && !selectedViewAngle.has(item.view_angle_h)) return false;
      if (selectedBrightness.size && !selectedBrightness.has(item.brightness_nits ?? '')) return false;
      if (selectedIp.size && !selectedIp.has(item.ip_rating)) return false;
      if (selectedScreenResolution.size && !selectedScreenResolution.has(item.screen_resolution ?? '')) return false;
      return true;
    });

    if (sortMode === 'pitch_asc') return results.sort((a, b) => a.pitch_mm - b.pitch_mm);
    return results.sort((a, b) => a.name.localeCompare(b.name, 'ru-RU'));
  }, [displays, selectedSeries, selectedPitch, selectedPixelType, selectedViewAngle, selectedBrightness, selectedIp, selectedScreenResolution, sortMode]);

  const filtered = catalogType === 'modules' ? filteredModules : filteredDisplays;

  return (
    <div className="space-y-6">
      <CatalogTypeSelector selected={catalogType} onSelect={setCatalogType} />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <button
          type="button"
          onClick={() => setMobileFilterOpen((value) => !value)}
          className="rounded-xl border border-white/20 px-4 py-3 text-left text-sm text-slate-200 lg:hidden"
        >
          {mobileFilterOpen ? 'Скрыть фильтры' : 'Показать фильтры'}
        </button>
        <aside className={`space-y-4 ${mobileFilterOpen ? 'block' : 'hidden'} lg:block`}>
          {catalogType === 'modules' ? (
            <>
              <FilterGroup title="Среда эксплуатации" values={['indoor', 'outdoor']} selected={selectedEnvironment} keyName="env" onChange={setParamValue} />
              <FilterGroup title="Шаг пикселя" values={moduleFacets.pitch} selected={selectedPitch} keyName="pitch" onChange={setParamValue} />
              <FilterGroup title="Исполнение" values={['yes', 'no']} selected={selectedFlexible} keyName="flex" onChange={setParamValue} />
              <FilterGroup title="Технология" values={moduleFacets.tech} selected={selectedTech} keyName="tech" onChange={setParamValue} />
              <FilterGroup title="Частота обновления" values={moduleFacets.refresh} selected={selectedRefresh} keyName="refresh" onChange={setParamValue} />
              <FilterGroup title="Размер" values={moduleFacets.size} selected={selectedSize} keyName="size" onChange={setParamValue} />
              <FilterGroup title="Наличие" values={['in_stock', 'preorder']} selected={selectedAvailability} keyName="availability" onChange={setParamValue} />
              <FilterGroup title="Метки" values={moduleFacets.badges} selected={selectedBadges} keyName="badges" onChange={setParamValue} />
            </>
          ) : (
            <>
              <FilterGroup title="Серия" values={displayFacets.series} selected={selectedSeries} keyName="series" onChange={setParamValue} />
              <FilterGroup title="Шаг пикселя" values={displayFacets.pitch} selected={selectedPitch} keyName="pitch" onChange={setParamValue} />
              <FilterGroup title="Тип пикселей" values={displayFacets.pixelType} selected={selectedPixelType} keyName="pixel_type" onChange={setParamValue} />
              <FilterGroup title="Угол обзора" values={displayFacets.viewAngles} selected={selectedViewAngle} keyName="view_angle" onChange={setParamValue} />
              <FilterGroup title="Яркость" values={displayFacets.brightness} selected={selectedBrightness} keyName="brightness" onChange={setParamValue} />
              <FilterGroup title="IP рейтинг" values={displayFacets.ip} selected={selectedIp} keyName="ip" onChange={setParamValue} />
              {displayFacets.screenResolution.length > 0 ? <FilterGroup title="Разрешение экрана" values={displayFacets.screenResolution} selected={selectedScreenResolution} keyName="screen_resolution" onChange={setParamValue} /> : null}
              <div className="rounded-xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">Все модели направления SAPPHIRE доступны только под заказ.</div>
            </>
          )}
          <button onClick={resetFilters} className="w-full rounded-xl border border-white/20 px-4 py-3 text-sm">Сбросить фильтры</button>
        </aside>
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-slate-300">Найдено: {filtered.length}</p>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <span>Сортировка</span>
              <select value={sortMode} onChange={(event) => setSort(event.target.value as SortMode)} className="rounded-lg border border-white/20 bg-slate-900 px-3 py-2 text-sm">
                <option value="pitch_asc">По шагу пикселя</option>
                {catalogType === 'modules' ? (
                  <>
                    <option value="price_asc">По цене: по возрастанию</option>
                    <option value="price_desc">По цене: по убыванию</option>
                  </>
                ) : null}
                <option value="name_asc">По названию</option>
              </select>
            </label>
          </div>
          <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => <CatalogCard key={item.id} item={item} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
