import { renderMarkdown } from './renderMarkdown'

// ── 缓存配置 ──
const CACHE_PREFIX = 'release-cache:'
export const CACHE_TTL = {
    github: 15 * 60 * 1000,
    gitee: 30 * 60 * 1000,
}

export const readCache = (key: string) => {
    try {
        const raw = localStorage.getItem(CACHE_PREFIX + key)
        if (!raw) return null
        const { data, time, ttl } = JSON.parse(raw)
        if (Date.now() - time > ttl) return null
        return data
    } catch {
        return null
    }
}

export const readStaleCache = (key: string) => {
    try {
        const raw = localStorage.getItem(CACHE_PREFIX + key)
        if (!raw) return null
        return JSON.parse(raw).data
    } catch {
        return null
    }
}

export const writeCache = (key: string, data: any, ttl: number) => {
    try {
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, time: Date.now(), ttl }))
    } catch {}
}

// ── 翻页请求 ──
export const fetchAllReleases = async (apiUrl: string): Promise<any[]> => {
    const baseUrl = apiUrl.replace(/[?&]per_page=\d+/, '')
    const separator = baseUrl.includes('?') ? '&' : '?'
    let page = 1
    let all: any[] = []

    while (true) {
        const url = `${baseUrl}${separator}per_page=100&page=${page}`

        let res: Response | null = null
        let lastError: any

        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                const controller = new AbortController()
                const timer = setTimeout(() => controller.abort(), 8000)
                res = await fetch(url, { signal: controller.signal })
                clearTimeout(timer)
                break
            } catch (e) {
                lastError = e
                if (attempt < 2) {
                    await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
                }
            }
        }

        if (!res) throw lastError

        if (res.status === 429) {
            const retryAfter = Number(res.headers.get('Retry-After') || 60)
            console.warn(`[fetchAllReleases] 触发限流，等待 ${retryAfter}s`)
            await new Promise(r => setTimeout(r, retryAfter * 1000))
            continue
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const data = await res.json()
        if (!Array.isArray(data) || data.length === 0) break

        all = all.concat(data)
        if (data.length < 100) break
        page++
    }

    return all
}

// ── 带缓存的完整请求 ──
export const fetchReleasesWithCache = async (
    meta: { apiUrl: string; platform: 'github' | 'gitee'; webUrl: string },
    item: { prerelease?: boolean }
) => {
    const cacheKey = meta.apiUrl
    const ttl = CACHE_TTL[meta.platform] || CACHE_TTL.github

    const cached = readCache(cacheKey)
    if (cached) return getTargetRelease(cached, item)

    const rawData = await fetchAllReleases(meta.apiUrl)
    const releases = transformReleases(rawData, meta.platform, meta.webUrl)
    writeCache(cacheKey, releases, ttl)
    return getTargetRelease(releases, item)
}

// ── 其余原有逻辑不变 ──
const stripReleasePath = (path: string) => path
    .replace(/\/releases(?:\/.*)?$/, '')
    .replace(/\/$/, '')

const normalizeRepoWebUrl = (repoPath: string, platform: 'gitee' | 'github') => {
    const host = platform === 'gitee' ? 'gitee.com' : 'github.com'
    return `https://${host}/${repoPath}`
}

export const resolveRepoMeta = (urlField?: string | null) => {
    if (!urlField) return null
    const url = urlField.trim()

    if (url.includes('gitee.com/')) {
        const path = stripReleasePath(url.split('gitee.com/')[1])
        return {
            platform: 'gitee' as const,
            apiUrl: `https://gitee.com/api/v5/repos/${path}/releases`,
            webUrl: normalizeRepoWebUrl(path, 'gitee'),
        }
    }

    if (url.includes('github.com/')) {
        const path = stripReleasePath(url.split('github.com/')[1])
        return {
            platform: 'github' as const,
            apiUrl: `https://api.github.com/repos/${path}/releases`,
            webUrl: normalizeRepoWebUrl(path, 'github'),
        }
    }

    return null
}

export const getTargetRelease = (releases: any[], item: { prerelease?: boolean }) => {
    if (!releases?.length) return null
    return item.prerelease
        ? releases[0]
        : releases.find(r => !r.prerelease) || releases[0]
}

const getGiteeReleaseUrl = (repoWebUrl: string | undefined, tagName: string, item: any) => {
    if (repoWebUrl && tagName) {
        return `${repoWebUrl}/releases/tag/${encodeURIComponent(tagName)}`
    }
    return item.html_url || item.url || ''
}

export const transformReleases = (rawData: any, platform: 'gitee' | 'github', repoWebUrl?: string) => {
    if (!Array.isArray(rawData)) return []

    const normalizedRawData = platform === 'gitee' ? [...rawData].reverse() : rawData

    return normalizedRawData.map(item => {
        const rawAssets = item.assets || []
        const filteredAssets = rawAssets.filter((asset: any) => {
            const assetName = (asset.name || '').toLowerCase()
            return !assetName.endsWith('.zip') && !assetName.endsWith('.tar.gz')
        })

        const isPrerelease = platform === 'gitee'
            ? (item.prerelease || ['beta', 'alpha', 'pre'].some(keyword => String(item.tag_name).toLowerCase().includes(keyword)))
            : item.prerelease

        const tagName = String(item.tag_name).toLowerCase() === 'beta' && item.name
            ? item.name.replace(/^legado_app_/, '')
            : item.tag_name

        return {
            tag_name: tagName,
            prerelease: isPrerelease,
            published_at: platform === 'gitee' ? item.created_at : item.published_at,
            body: renderMarkdown(item.body || ''),
            html_url: platform === 'gitee'
                ? getGiteeReleaseUrl(repoWebUrl, tagName, item)
                : item.html_url,
            assets: filteredAssets.map((asset: any) => ({
                id: platform === 'gitee' ? asset.browser_download_url : asset.id,
                name: asset.name,
                browser_download_url: asset.browser_download_url,
                size: platform === 'gitee' ? null : asset.size,
            })),
        }
    })
}