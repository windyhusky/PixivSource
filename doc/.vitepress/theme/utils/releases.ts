import { renderMarkdown } from './renderMarkdown'

// ── 类型定义 ──
type Platform = 'github' | 'gitee' | string;

interface PlatformConfig {
    apiBase: string;
    webBase: string;
    cacheTTL: number;

    // 仓库路径解析
    normalizeRepoPath: (url: string) => string | null;

    // 构建翻页 URL（可自定义）
    buildFetchUrl: (repoPath: string, page: number, perPage: number) => string;

    // 转换单个 release（各平台字段差异在这里处理）
    transformRelease: (item: any, repoWebUrl: string) => any;

    // 是否需要反转数组（gitee 历史数据是倒序）
    shouldReverse?: boolean;
}

// ── 平台配置表 ──
const PLATFORM_CONFIGS: Record<Platform, PlatformConfig> = {
    github: {
        apiBase: 'https://api.github.com/repos/',
        webBase: 'https://github.com/',
        cacheTTL: 15 * 60 * 1000,

        normalizeRepoPath: (url) => url.match(/github\.com\/([^/]+\/[^/]+)/)?.[1] || null,

        buildFetchUrl: (repoPath, page, perPage) =>
            `https://legado-repo.tnt-wwxs-tz.workers.dev/?platform=github&repo=${encodeURIComponent(repoPath)}&per_page=${perPage}&page=${page}`,

        transformRelease: (item, repoWebUrl) => ({
            tag_name: item.tag_name,
            prerelease: item.prerelease,
            published_at: item.published_at,
            body: renderMarkdown(item.body || ''),
            html_url: item.html_url,
            assets: (item.assets || [])
                .filter((a: any) => {
                    const name = (a.name || '').toLowerCase();
                    return !name.endsWith('.zip') && !name.endsWith('.tar.gz');
                })
                .map((a: any) => ({
                    id: a.id,
                    name: a.name,
                    browser_download_url: a.browser_download_url,
                    size: a.size,
                })),
        }),
    },

    gitee: {
        apiBase: 'https://gitee.com/api/v5/repos/',
        webBase: 'https://gitee.com/',
        cacheTTL: 30 * 60 * 1000,
        shouldReverse: true,

        normalizeRepoPath: (url) => url.match(/gitee\.com\/([^/]+\/[^/]+)/)?.[1] || null,

        buildFetchUrl: (repoPath, page, perPage) =>
            `https://legado-repo.tnt-wwxs-tz.workers.dev/?platform=gitee&repo=${encodeURIComponent(repoPath)}&per_page=${perPage}&page=${page}`,

        transformRelease: (item, repoWebUrl) => {
            const rawAssets = item.assets || [];
            const filteredAssets = rawAssets.filter((asset: any) => {
                const name = (asset.name || '').toLowerCase();
                return !name.endsWith('.zip') && !name.endsWith('.tar.gz');
            });

            const isPrerelease = item.prerelease ||
                ['beta', 'alpha', 'pre'].some(k => String(item.tag_name).toLowerCase().includes(k));

            const tagName = String(item.tag_name).toLowerCase() === 'beta' && item.name
                ? item.name.replace(/^legado_app_/, '')
                : item.tag_name;

            const latestAssetDate = rawAssets.length
                ? rawAssets.reduce((latest: string, a: any) => a.updated_at > latest ? a.updated_at : latest, rawAssets[0].updated_at)
                : null;

            return {
                tag_name: tagName,
                prerelease: isPrerelease,
                published_at: latestAssetDate || item.created_at,
                body: renderMarkdown(item.body || ''),
                html_url: `${repoWebUrl}/releases/tag/${encodeURIComponent(tagName)}`,
                assets: filteredAssets.map((asset: any) => ({
                    id: asset.browser_download_url,
                    name: asset.name,
                    browser_download_url: asset.browser_download_url,
                    size: null,
                })),
            };
        },
    },
};

// ── 缓存工具 ──
const CACHE_PREFIX = 'release-cache:';

export const readCache = (key: string) => { /* ... 保持不变 */ };
export const readStaleCache = (key: string) => { /* ... 保持不变 */ };
export const writeCache = (key: string, data: any, ttl: number) => { /* ... 保持不变 */ };

// ── 翻页请求（支持新旧调用方式） ──
export const fetchAllReleases = async (
    platformOrUrl: Platform | string,
    repoPath?: string
): Promise<any[]> => {

    let platform: Platform;
    let finalRepoPath = repoPath;

    // 兼容旧代码：如果第一个参数是 URL，则从中解析 platform 和 repoPath
    if (typeof platformOrUrl === 'string' && platformOrUrl.includes('api.')) {
        if (platformOrUrl.includes('gitee.com')) {
            platform = 'gitee';
        } else if (platformOrUrl.includes('github.com') || platformOrUrl.includes('api.github.com')) {
            platform = 'github';
        } else {
            throw new Error(`Unsupported platform URL: ${platformOrUrl}`);
        }

        // 从 URL 中提取 repoPath
        const match = platformOrUrl.match(/repos\/([^/]+\/[^/]+)/);
        finalRepoPath = match ? match[1] : '';
    } else {
        platform = platformOrUrl as Platform;
    }

    const config = PLATFORM_CONFIGS[platform];
    if (!config) throw new Error(`Unsupported platform: ${platform}`);

    if (!finalRepoPath) {
        throw new Error('Cannot resolve repo path');
    }

    let page = 1;
    const perPage = 100;
    let all: any[] = [];

    while (true) {
        const url = config.buildFetchUrl(finalRepoPath, page, perPage);

        let res: Response | null = null;
        let lastError: any;

        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), 8000);
                res = await fetch(url, { signal: controller.signal });
                clearTimeout(timer);
                break;
            } catch (e) {
                lastError = e;
                if (attempt < 2) await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
            }
        }

        if (!res) throw lastError;

        if (res.status === 429) {
            const retryAfter = Number(res.headers.get('Retry-After') || 60);
            console.warn(`[fetchAllReleases] ${platform} 触发限流，等待 ${retryAfter}s`);
            await new Promise(r => setTimeout(r, retryAfter * 1000));
            continue;
        }

        if (!res.ok) throw new Error(`HTTP ${res.status} on ${platform}`);

        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) break;

        all = all.concat(data);
        if (data.length < perPage) break;
        page++;
    }

    return config.shouldReverse ? all.reverse() : all;
};

// ── 带缓存的请求 ──
export const fetchReleasesWithCache = async (
    meta: { apiUrl: string; platform: Platform; webUrl: string },
    item: { prerelease?: boolean }
) => {
    const config = PLATFORM_CONFIGS[meta.platform];
    if (!config) throw new Error(`Unsupported platform: ${meta.platform}`);

    const cacheKey = meta.apiUrl;
    const cached = readCache(cacheKey);
    if (cached) return getTargetRelease(cached, item);

    // 提取 repoPath
    const repoPath = config.normalizeRepoPath(meta.apiUrl) || config.normalizeRepoPath(meta.webUrl);
    if (!repoPath) throw new Error('Cannot resolve repo path');

    const rawData = await fetchAllReleases(meta.platform, repoPath);
    const releases = rawData.map(r => config.transformRelease(r, meta.webUrl));

    writeCache(cacheKey, releases, config.cacheTTL);
    return getTargetRelease(releases, item);
};

// ── 其他函数保持不变 ──
export const getTargetRelease = (releases: any[], item: { prerelease?: boolean }) => {
    if (!releases?.length) return null;
    return item.prerelease ? releases[0] : releases.find(r => !r.prerelease) || releases[0];
};

export const resolveRepoMeta = (urlField?: string | null) => {
    if (!urlField) return null;
    const url = urlField.trim().toLowerCase();

    for (const [platform, config] of Object.entries(PLATFORM_CONFIGS)) {
        const repoPath = config.normalizeRepoPath(url);
        if (repoPath) {
            return {
                platform: platform as Platform,
                apiUrl: `${config.apiBase}${repoPath}/releases`,
                webUrl: `${config.webBase}${repoPath}`,
            };
        }
    }
    return null;
};

// ==================== 兼容旧代码导出 ====================

// 保留 CACHE_TTL 导出，供 DownloadCard.vue 等旧代码使用
export const CACHE_TTL = {
    github: PLATFORM_CONFIGS.github.cacheTTL,
    gitee: PLATFORM_CONFIGS.gitee.cacheTTL,
} as const;

// 兼容 transformReleases（很多地方可能还在使用）
export const transformReleases = (rawData: any, platform: Platform, repoWebUrl?: string) => {
    const config = PLATFORM_CONFIGS[platform];
    if (!config) {
        console.warn(`[transformReleases] Unsupported platform: ${platform}`);
        return [];
    }
    return rawData.map((item: any) => config.transformRelease(item, repoWebUrl || ''));
};