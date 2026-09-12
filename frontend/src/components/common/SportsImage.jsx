export default function SportsImage({ src, fallbackSrc, alt = '', className, loading = 'lazy' }) {
  const handleImageError = (event) => {
    if (!fallbackSrc || event.currentTarget.src.endsWith(fallbackSrc)) return
    event.currentTarget.src = fallbackSrc
  }

  return <img src={src} alt={alt} className={className} loading={loading} decoding="async" onError={handleImageError} />
}
