// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { useMemo } from 'react';
import {InlineXML, XMLContent} from './parsers'
import type { OSTIArticle } from '../shared/interfaces';

interface ArticleCardProps {
  article: OSTIArticle;
  showAbstract?: boolean;
  onClose?: () => void;
}

function ArticleCard({ article, showAbstract = true, onClose }: ArticleCardProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Find citation link
  const citationLink = useMemo(() =>
    article.links.find((x) => x.rel === 'citation'),
    [article.links]
  );

  // Product type display logic
  const renderProductType = () => {
    if (article.product_type === 'Journal Article') {
      return (
        <>
          {article.journal_name || 'N/A'}
          {article.journal_volume && `, Volume ${article.journal_volume}`}
          {article.journal_issue && `, Issue ${article.journal_issue}`}
        </>
      );
    } else if (article.product_type === 'Conference') {
      return article.conference_info || 'N/A';
    } else {
      return article.product_type || 'N/A';
    }
  };
  console.log('Title content:', article.title);
  return (
      <article
          className="pane relative bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-6">
        {/* Close button */}
        {onClose && (
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-2xl hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
                aria-label="Close"
            >
              ×
            </button>
        )}

        {/* Header with ID and Date */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-lightgray text-standard rounded-full px-3 py-1 text-sm">
              OSTI.gov:{article.osti_id}
            </div>
            <div className="text-muted flex items-center space-x-1 text-sm">
              <i className="bi bi-calendar-event"></i>
              <span>{formatDate(article.publication_date)}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          {citationLink ? (

              <a href={citationLink.href}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="items-start gap-2 text-xl font-bold"
              >
                <InlineXML content={article.title} />
                <i className="bi bi-box-arrow-right"></i>
              </a>
          ) : (
              <p className="items-start text-xl font-bold"><XMLContent content={article.title} /></p>
          )}
        </div>

        {/* Authors */}
        <div className="text-muted mt-2 mb-4 flex items-start text-sm">
          <i className="bi bi-people mr-1"></i>
          <div>
            {article.authors.map((author, i) => (
                <span key={i}>
              {author.orcid ? (
                  <a
                      href={`https://orcid.org/${author.orcid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                  >
                    {author.name}
                  </a>
              ) : (
                  <span>{author.name}</span>
              )}
                  {i < article.authors.length - 1 && ',\u00A0'}
            </span>
            ))}
          </div>
        </div>

        {/* Product Type Info */}
        <div className="text-standard">
          {renderProductType()}
        </div>

        {/* DOI Button */}
        {article.doi && (

            <a href={`https://doi.org/${article.doi}`}
               target="_blank"
               rel="noopener noreferrer"
               className="btn btn-outline mt-2 block w-min text-sm"
            >
              <i className="bi bi-qr-code mr-1"></i>
              DOI
            </a>
        )}

        {/* Abstract/Description */}
        {showAbstract && article?.description?.length ? (
          <div className="mt-4 mb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <XMLContent content={article.description} />
    </div>
) : null}
      </article>
  );
}

export default ArticleCard;
