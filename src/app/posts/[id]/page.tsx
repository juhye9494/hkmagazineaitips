// Post detail page with proper JSX structure
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full">
            AI 가이드
          </span>
          <span className="text-sm text-gray-500">
            {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
          {post.title}
        </h1>
      </div>

      {/* Post Card */}
      <Link
        key={post.id}
        href={`/posts/${post.id}`}
        className="group bg-white rounded-[2rem] overflow-hidden border border-gray-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-sm flex flex-col"
      >
        {/* Fixed aspect ratio for image */}
        <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative">
          {post.image_url ? (
            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
              AI Archive Card
            </div>
          )}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-white/90 backdrop-blur-sm text-[#0056FF] px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
              {post.category || '기타'}
            </span>
          </div>
        </div>
        <div className="p-8 flex-1 flex flex-col">
          <h3 className="text-xl font-bold mb-8 leading-tight group-hover:text-[#0056FF] transition-colors h-[3.5rem] line-clamp-2">
            {post.title}
          </h3>
          {/* Show extra info on card hover */}
          <div className="mt-auto flex flex-col gap-2 text-sm text-gray-500">
            <span>
              작성자: <span className="text-gray-900">{post.author_name || 'Member'}</span>
            </span>
            <span>
              소요시간: <span className="text-gray-900">{post.working_time || '-'}</span>
            </span>
            <span>
              비용 절감: <span className="text-gray-900">{post.cost_saving || '-'}</span>
            </span>
          </div>
          <div className="mt-4 flex justify-between items-center pt-6 border-t border-gray-50">
            <span className="text-sm font-medium text-gray-400">
              작성자: <span className="text-gray-900">Member</span>
            </span>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-[#0056FF] group-hover:bg-[#0056FF] group-hover:text-white transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
