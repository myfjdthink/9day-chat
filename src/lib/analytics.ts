// src/lib/analytics.ts
type Attribution = {
  source: string;       // utm_source / referral / direct
  medium: string;       // utm_medium / referral / none
  campaign: string;     // utm_campaign
  content: string;      // utm_content
  term: string;         // utm_term
  referrer: string;     // document.referrer 域名
};

const FT_KEY = '_ga_first_touch_v1';
const LT_KEY = '_ga_latest_touch_v1';

// 简单的 localStorage 封装
const storage = {
  get<T>(k: string): T | null {
    try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; }
  },
  set<T>(k: string, v: T) { localStorage.setItem(k, JSON.stringify(v)); }
};

function getDomain(ref: string) {
  try { return new URL(ref).hostname; } catch { return ''; }
}

function parseUTM(search = location.search): Partial<Attribution> {
  const p = new URLSearchParams(search);
  return {
    source: p.get('utm_source') ?? undefined,
    medium: p.get('utm_medium') ?? undefined,
    campaign: p.get('utm_campaign') ?? undefined,
    content: p.get('utm_content') ?? undefined,
    term: p.get('utm_term') ?? undefined,
  };
}

function buildAttribution(): Attribution {
  const utm = parseUTM();
  const refDomain = getDomain(document.referrer);

  // 有 UTM 优先用 UTM；否则用 referrer；再否则 direct
  const hasUtm = !!utm.source || !!utm.medium || !!utm.campaign;
  if (hasUtm) {
    return {
      source: utm.source || '(utm_missing)',
      medium: utm.medium || '(utm_missing)',
      campaign: utm.campaign || '(none)',
      content: utm.content || '(none)',
      term: utm.term || '(none)',
      referrer: refDomain || '(none)',
    };
  }

  if (refDomain && refDomain !== location.hostname) {
    return {
      source: 'referral',
      medium: 'referral',
      campaign: '(none)',
      content: '(none)',
      term: '(none)',
      referrer: refDomain,
    };
  }

  return {
    source: 'direct',
    medium: '(none)',
    campaign: '(none)',
    content: '(none)',
    term: '(none)',
    referrer: '(none)',
  };
}

export function initAnalytics() {
  // 计算本次触点
  const current = buildAttribution();

  // 首次触点（first touch）只写一次
  const first = storage.get<Attribution>(FT_KEY) ?? current;
  storage.set(FT_KEY, first);

  // 最近触点（latest touch）每次更新（如 UTM/new referrer）
  storage.set(LT_KEY, current);

  // 把来源作为 user_properties 注入（用于所有事件的切片分析）
  if ((window as any).gtag) {
    (window as any).gtag('set', 'user_properties', {
      ft_source: first.source,
      ft_medium: first.medium,
      ft_campaign: first.campaign,
      ft_referrer: first.referrer,
      lt_source: current.source,
      lt_medium: current.medium,
      lt_campaign: current.campaign,
      lt_referrer: current.referrer,
    });
  }
}

// SPA 路由变更的 page_view（必须）
export function trackPageView(path?: string) {
  if (!(window as any).gtag) return;
  (window as any).gtag('event', 'page_view', {
    page_title: document.title,
    page_location: location.href,
    page_path: path || location.pathname + location.search,
  });
}

// 通用事件打点（命名 & 参数：snake_case）
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (!(window as any).gtag) return;
  (window as any).gtag('event', eventName, params);
}

// 产品功能指标常用封装
export function trackFeatureUse(feature_name: string, extras: {
  surface?: string;          // 入口/页面，如 'dashboard'
  action?: string;           // 'click' | 'start' | 'complete' ...
  variant?: string;          // A/B 版本
  success?: boolean;         // 结果
  duration_ms?: number;      // 时长
  value?: number;            // 业务价值（可选）
} = {}) {
  trackEvent('feature_use', { feature_name, ...extras });
}