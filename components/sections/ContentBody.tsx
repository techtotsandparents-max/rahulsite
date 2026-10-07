import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ContentBody({ content = '', photos = [], videos = [] }: { content?: string; photos?: string[]; videos?: string[] }) {
  return <div style={{ lineHeight: 1.8, overflowWrap: 'anywhere' }}>
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
      img: ({ src, alt }) => <img src={src} alt={alt || ''} loading="lazy" style={{ maxWidth: '100%', height: 'auto', borderRadius: 6 }} />,
      a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
      p: ({ children }) => <p style={{ marginBottom: 18 }}>{children}</p>,
      pre: ({ children }) => <pre style={{ overflowX: 'auto', padding: 16, background: 'var(--bg-secondary)', marginBottom: 18 }}>{children}</pre>,
    }}>{content}</ReactMarkdown>
    {photos.length > 0 && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 16, margin: '24px 0' }}>{photos.map((url, index) => <a href={url} key={`${index}-${url}`} target="_blank" rel="noopener noreferrer"><img src={url} alt={`Photo ${index + 1}`} loading="lazy" style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 6 }} /></a>)}</div>}
    {videos.map((url, index) => <video key={`${index}-${url}`} src={url} controls preload="metadata" style={{ width: '100%', maxHeight: 600, margin: '16px 0' }} />)}
  </div>;
}