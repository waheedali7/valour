'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import PageShell from '@/components/page/PageShell';
import PageCta from '@/components/page/PageCta';
import SplitChars from '@/components/ui/SplitChars';
import { ArrowIcon, ChevronIcon, CloseIcon, Emblem } from '@/components/ui/Icons';
import { ScrollTrigger } from '@/lib/gsap';
import { FILTERS, buildGroups, filterOptions, findGroup, formatPrice, matchesFilters } from '@/lib/shop';

const filterLabel = (key) => FILTERS.find((f) => f.key === key)?.label ?? key;

/** Shop: database products by category (tabs + sub-categories), with filters like the main site. */
export default function Shop({ categories, products, unavailable, initialCategory }) {
  const groups = useMemo(() => buildGroups(categories, products), [categories, products]);
  const [slug, setSlug] = useState(() => (findGroup(groups, initialCategory).top ? initialCategory : null));
  const [active, setActive] = useState({});
  const [open, setOpen] = useState(null);
  const barRef = useRef(null);

  const { top, sub } = findGroup(groups, slug);
  const scope = sub ?? top;
  const inScope = useMemo(() => (scope ? products.filter(scope.match) : products), [scope, products]);
  const filters = useMemo(() => filterOptions(inScope), [inScope]);
  const visible = inScope.filter((p) => matchesFilters(p, active));
  const activeEntries = Object.entries(active);

  const selectCategory = (next) => {
    const found = findGroup(groups, next);
    const nextScope = found.sub ?? found.top;
    const nextProducts = nextScope ? products.filter(nextScope.match) : products;
    // Keep filters whose value still exists in the new category; drop the rest.
    setActive((prev) => Object.fromEntries(Object.entries(prev).filter(([k, v]) => nextProducts.some((p) => p[k] === v))));
    setSlug(nextScope ? next : null);
    setOpen(null);
    const url = new URL(window.location.href);
    if (nextScope) url.searchParams.set('category', next);
    else url.searchParams.delete('category');
    window.history.replaceState(window.history.state, '', url);
  };

  const setFilter = (key, value) => {
    setActive((prev) => {
      const next = { ...prev };
      if (value) next[key] = value;
      else delete next[key];
      return next;
    });
    setOpen(null);
  };

  // Close an open dropdown on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (!barRef.current?.contains(e.target)) setOpen(null); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(null); };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // The grid height changes with the filters: re-measure the scroll reveals below it (footer).
  const visibleKey = visible.map((p) => p.id).join(',');
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [visibleKey]);

  const showBar = !unavailable && products.length > 0;

  return (
    <PageShell>
      <section className="shop-head">
        <p className="eyebrow" data-reveal><span className="rule" />The Shop</p>
        <div className="shop-head__row">
          <h1 className="display shop-head__title" data-split>
            <SplitChars text="Wear" /><br /><em><SplitChars text="The Light." /></em>
          </h1>
          <p className="shop-head__intro" data-reveal>
            The Lucent collection and its straps. Grade 5 titanium, an automatic movement and a dial built from light,
            in six colours.
          </p>
        </div>
      </section>

      <section className="shop" aria-label="Products">
        {showBar && (
          <div className="shop-bar" ref={barRef}>
            <div className="shop-tabs" role="group" aria-label="Categories">
              <button type="button" className={`shop-tab${!top ? ' is-active' : ''}`} aria-pressed={!top} onClick={() => selectCategory(null)}>
                All <sup>{products.length}</sup>
              </button>
              {groups.map((g) => (
                <button type="button" key={g.slug} className={`shop-tab${top === g ? ' is-active' : ''}`} aria-pressed={top === g}
                  onClick={() => selectCategory(g.slug)}>
                  {g.name} <sup>{g.count}</sup>
                </button>
              ))}
            </div>

            {top && top.children.length > 0 && (
              <div className="shop-subs" role="group" aria-label={`${top.name} categories`}>
                <button type="button" className="shop-sub" aria-pressed={!sub} onClick={() => selectCategory(top.slug)}>All {top.name}</button>
                {top.children.map((c) => (
                  <button type="button" key={c.slug} className="shop-sub" aria-pressed={sub === c} onClick={() => selectCategory(c.slug)}>
                    {c.name}
                  </button>
                ))}
              </div>
            )}

            <div className="shop-tools">
              <div className="shop-filters">
                {filters.length > 0 && <span className="shop-filters__label">Filter</span>}
                {filters.map((f) => {
                  const current = f.options.find((o) => o.value === active[f.key]);
                  return (
                    <div className="shop-filter" key={f.key}>
                      <button type="button" className={`shop-filter__btn${current ? ' is-set' : ''}`}
                        aria-expanded={open === f.key} aria-controls={`filter-${f.key}`}
                        onClick={() => setOpen((o) => (o === f.key ? null : f.key))}>
                        <span>{current ? current.label : f.label}</span>
                        <ChevronIcon />
                      </button>
                      {open === f.key && (
                        <ul className="shop-filter__menu" id={`filter-${f.key}`} aria-label={f.label} data-lenis-prevent>
                          <li>
                            <button type="button" aria-pressed={!current} onClick={() => setFilter(f.key, null)}>All</button>
                          </li>
                          {f.options.map((o) => (
                            <li key={o.value}>
                              <button type="button" aria-pressed={current === o} onClick={() => setFilter(f.key, o.value)}>
                                {f.key === 'color' && <i className="shop-swatch" style={{ '--sw': o.accent ?? 'var(--faint)' }} aria-hidden="true" />}
                                {o.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="shop-count" aria-live="polite">
                {visible.length} {visible.length === 1 ? 'piece' : 'pieces'}
              </p>
            </div>

            {activeEntries.length > 0 && (
              <div className="shop-pills">
                {activeEntries.map(([key, value]) => {
                  const label = filters.find((f) => f.key === key)?.options.find((o) => o.value === value)?.label ?? value;
                  return (
                    <button type="button" key={key} className="shop-pill" onClick={() => setFilter(key, null)}
                      aria-label={`Remove filter ${filterLabel(key)}: ${label}`}>
                      <span>{filterLabel(key)}</span>{label}<CloseIcon />
                    </button>
                  );
                })}
                <button type="button" className="shop-reset" onClick={() => setActive({})}>Clear all</button>
              </div>
            )}
          </div>
        )}

        {unavailable ? (
          <Empty title="The shop is resting." body="We couldn’t load the collection just now. Please try again in a moment.">
            <a href="/shop" className="btn">Try Again <ArrowIcon /></a>
          </Empty>
        ) : products.length === 0 ? (
          <Empty title="New pieces are on their way." body="The collection is being prepared. Come back soon, or build your own in the configurator.">
            <Link href="/#configure" className="btn">Open the Configurator <ArrowIcon /></Link>
          </Empty>
        ) : visible.length === 0 ? (
          <Empty title="Nothing matches, yet." body="No pieces match these filters. Adjust or clear them to see more of the collection.">
            <button type="button" className="btn" onClick={() => setActive({})}>Clear Filters</button>
          </Empty>
        ) : (
          <ul className="shop-grid">
            {visible.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </ul>
        )}
      </section>

      <PageCta
        image="/media/editorial/red-dial-macro.webp" width="1600" height="891"
        eyebrow="Make It Yours"
        title={<><SplitChars text="Your Dial," /><br /><em><SplitChars text="Your Strap." /></em></>}
        body="Pair any case, dial and strap in the configurator, or book an appointment to see the collection in person."
      >
        <Link href="/#configure" className="btn btn--solid">Build Your Own <ArrowIcon /></Link>
        <Link href="/servicing" className="btn">Client Care</Link>
      </PageCta>
    </PageShell>
  );
}

function ProductCard({ product: p, index }) {
  const specs = [p.material, p.movement].filter(Boolean).join(' · ');
  return (
    <li className="shop-card" style={{ '--c-accent': p.accent ?? 'var(--glow)', '--i': index % 12 }}>
      <a href={p.href} className="shop-card__link">
        <div className="shop-card__stage">
          <div className="shop-card__glow" aria-hidden="true" />
          {(p.limited || !p.available) && (
            <div className="shop-card__badges">
              {p.limited && <span className="shop-card__badge">Limited</span>}
              {!p.available && <span className="shop-card__badge shop-card__badge--out">Sold Out</span>}
            </div>
          )}
          {p.image
            ? <img src={p.image} alt={p.name} loading={index < 6 ? 'eager' : 'lazy'} />
            : <Emblem className="shop-card__placeholder" />}
        </div>
        <div className="shop-card__meta">
          {p.sku && <p className="shop-card__ref">Ref. {p.sku}</p>}
          <h3 className="display shop-card__name">{p.name}</h3>
          {p.subtitle && <p className="shop-card__sub">{p.subtitle}</p>}
          <div className="shop-card__row">
            <span className="shop-card__specs">{specs}</span>
            <span className="shop-card__price">
              {p.compareAtPrice != null && <s>{formatPrice(p.compareAtPrice)}</s>}
              {formatPrice(p.price)}
            </span>
          </div>
          <span className="shop-card__cta">View Details <ArrowIcon /></span>
        </div>
      </a>
    </li>
  );
}

function Empty({ title, body, children }) {
  return (
    <div className="shop-empty">
      <Emblem className="shop-empty__mark" />
      <h2 className="display">{title}</h2>
      <p>{body}</p>
      {children}
    </div>
  );
}
