import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_BLOGS } from './BlogsList';
import { ROUTES } from '../../../constants/routes';
import PageHeader from '../../../components/common/PageHeader/PageHeader';

const BlogDetail = () => {
  const { slug } = useParams();
  const blog = MOCK_BLOGS.find((b) => b.slug === slug) || MOCK_BLOGS[0];

  return (
    <div className="blog-detail-page">
      <PageHeader
        eyebrow={blog.category ? blog.category.toUpperCase() : 'PILGRIM GUIDE'}
        title={blog.title}
        subtitle={`Published on ${blog.date} by TTD Yatra Editorial Desk`}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Blog', path: ROUTES.BLOG },
          { label: blog.title },
        ]}
      />

      <div className="container section" style={{ maxWidth: '840px' }}>
        <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '32px' }}>
          <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '360px', objectFit: 'cover' }} />
          <div style={{ padding: '36px' }}>
            <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--color-neutral-800)', whiteSpace: 'pre-line', marginBottom: '24px' }}>
              {blog.content}
            </p>

            <div style={{ background: 'var(--color-sandal-100)', padding: '24px', borderRadius: '12px', marginTop: '32px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--color-maroon-900)', marginBottom: '8px' }}>
                Planning your Tirumala trip?
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Explore our handpicked hotel stays and private cabs to make your pilgrimage seamless.
              </p>
              <div className="flex justify-center gap-4">
                <Link to={ROUTES.PACKAGES} className="btn btn-gold btn-sm">
                  View Tour Packages
                </Link>
                <Link to={ROUTES.HOTELS} className="btn btn-outline btn-sm">
                  Find Hotels
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to={ROUTES.BLOG} className="btn btn-ghost">
            ← Back to All Articles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
