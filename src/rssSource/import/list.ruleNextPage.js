@js:
try {
    url = String(java.get('url'));
    url = url.replace(/(pg=)(\d+)/, (mat, $1, $2) => {
        return $1 + (~~$2 + 1)
    }).replace(url, '');
} catch (err) {
    url = ""
}
url