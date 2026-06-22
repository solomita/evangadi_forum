import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminService } from '../../services/admin/admin.service.js';
import styles from './AdminQueue.module.css';
import ui from '../../styles/pageStates.module.css';

const CATEGORY_LABELS = {
  spam:         'Spam',
  harassment:   'Harassment',
  off_topic:    'Off-topic',
  low_quality:  'Low quality',
};

export default function AdminQueue() {
  const [posts, setPosts]       = useState([]);
  const [meta, setMeta]         = useState({ total: 0, page: 1, limit: 20 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]       = useState(null);
  const [actioningId, setActioningId] = useState(null);
  const [actionMsg, setActionMsg]     = useState(null);

  const fetchQueue = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminService.getQueue({ page, limit: meta.limit });
      setPosts(result.data || []);
      setMeta(result.meta || { total: 0, page, limit: 20 });
    } catch (err) {
      setError(err.message || 'Failed to load moderation queue.');
    } finally {
      setIsLoading(false);
    }
  }, [meta.limit]);

  useEffect(() => { fetchQueue(1); }, [fetchQueue]);

  const handleAction = async (postId, action) => {
    if (actioningId === postId) return;
    setActioningId(postId);
    setActionMsg(null);
    try {
      const fn = action === 'approve' ? adminService.approvePost
               : action === 'remove'  ? adminService.removePost
               : adminService.escalatePost;
      const result = await fn(postId);
      setActionMsg(result.message || 'Done.');
      setPosts(prev => prev.filter(p => p.postId !== postId));
    } catch (err) {
      setActionMsg(err.message || 'Action failed.');
    } finally {
      setActioningId(null);
    }
  };

  const totalPages = Math.ceil(meta.total / meta.limit);

  return (
    <div className={styles.page}>
      {actionMsg && (
        <div className={styles.actionBanner}>{actionMsg}</div>
      )}

      {isLoading && (
        <p className={`${ui.pageStates__message} ${ui['pageStates__message--loading']}`}>
          Loading moderation queue...
        </p>
      )}

      {!isLoading && error && (
        <p className={`${ui.pageStates__message} ${ui['pageStates__message--error']}`}>{error}</p>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <div className={`${ui.pageStates__message} ${ui['pageStates__message--empty']}`}>
          No posts pending review. The queue is clear.
        </div>
      )}

      {!isLoading && !error && posts.length > 0 && (
        <>
          <p className={styles.count}>{meta.total} post{meta.total !== 1 ? 's' : ''} pending review</p>

          <div className={styles.list}>
            {posts.map(post => (
              <article key={post.postId} className={styles.card}>
                <div className={styles.cardMeta}>
                  <span className={`${styles.categoryPill} ${styles[`categoryPill--${post.moderationCategory}`]}`}>
                    {CATEGORY_LABELS[post.moderationCategory] || post.moderationCategory}
                  </span>
                  <span className={styles.postType}>{post.postType}</span>
                  <span className={styles.score}>AI score: {(post.moderationScore * 100).toFixed(0)}%</span>
                  <span className={styles.timestamp}>
                    {post.flaggedAt ? new Date(post.flaggedAt).toLocaleDateString() : ''}
                  </span>
                </div>

                <p className={styles.content}>{post.content}</p>

                <p className={styles.aiReason}>{post.aiReason}</p>

                <div className={styles.authorRow}>
                  <div className={styles.authorAvatar}>
                    {post.author?.firstName?.[0]}{post.author?.lastName?.[0]}
                  </div>
                  <div>
                    <span className={styles.authorName}>
                      {post.author?.firstName} {post.author?.lastName}
                    </span>
                    <span className={styles.incidentCount}>
                      {post.author?.incidentCount ?? 0} prior incident{post.author?.incidentCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles['actionBtn--approve']}`}
                    onClick={() => handleAction(post.postId, 'approve')}
                    disabled={actioningId === post.postId}
                  >
                    <CheckCircle size={14} />
                    Approve
                  </button>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles['actionBtn--remove']}`}
                    onClick={() => handleAction(post.postId, 'remove')}
                    disabled={actioningId === post.postId}
                  >
                    <XCircle size={14} />
                    Remove
                  </button>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles['actionBtn--escalate']}`}
                    onClick={() => handleAction(post.postId, 'escalate')}
                    disabled={actioningId === post.postId}
                  >
                    <AlertTriangle size={14} />
                    Escalate
                  </button>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => fetchQueue(meta.page - 1)}
                disabled={meta.page <= 1}
              >
                <ChevronLeft size={16} />
              </button>
              <span className={styles.pageLabel}>Page {meta.page} of {totalPages}</span>
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => fetchQueue(meta.page + 1)}
                disabled={meta.page >= totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
