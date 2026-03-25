import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, User, Tag, CheckCircle, Lightbulb, Wrench, ExternalLink, FileText, Image, Video, Code, Sparkles } from 'lucide-react';
import { methods as defaultMethods, Method } from '../data/methods';
import { useState, useEffect } from 'react';
import { getFirebaseGuides } from '../../lib/api';

const iconMap: Record<string, any> = {
  '문서작성': FileText,
  '디자인': Image,
  '멀티미디어': Video,
  '개발': Code,
};

const tagColorMap: Record<string, string> = {
  '문서작성': 'bg-blue-100 text-blue-700',
  '디자인': 'bg-pink-100 text-pink-700',
  '멀티미디어': 'bg-purple-100 text-purple-700',
  '개발': 'bg-green-100 text-green-700',
};

export function MethodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allMethods, setAllMethods] = useState<Method[]>(defaultMethods);

  // Load custom guides from Firebase on mount
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const firebaseGuides = await getFirebaseGuides();
        const hydratedGuides = firebaseGuides.map(guide => ({
          ...guide,
          icon: iconMap[guide.tag] || Sparkles,
          tagColor: tagColorMap[guide.tag] || 'bg-blue-100 text-blue-700'
        }));
        setAllMethods([...hydratedGuides, ...defaultMethods]);
      } catch (error) {
        console.error('Failed to load custom guides from Firebase:', error);
      }
    };
    fetchGuides();
  }, []);

  const method = allMethods.find((m) => m.id === id);

  if (!method) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">가이드를 찾을 수 없습니다</h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const Icon = method.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">돌아가기</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8"
        >
          <div className="flex items-start gap-6 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center flex-shrink-0">
              <Icon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <span className={`inline-block px-3 py-1.5 rounded-lg text-sm font-medium mb-3 ${method.tagColor}`}>
                {method.tag}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {method.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {method.description}
              </p>
            </div>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-5 h-5" />
              <span className="text-sm">
                작성자: <span className="font-medium text-gray-900">{method.author}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span className="text-sm">읽는 시간: 약 5분</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Tag className="w-5 h-5" />
              <span className="text-sm">{method.tag}</span>
            </div>
          </div>
        </motion.div>

        {/* Steps Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <CheckCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">단계별 가이드</h2>
          </div>

          <div className="space-y-6">
            {method.steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-6 border border-gray-100 hover:border-blue-200 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {step.content}
                </p>
                {step.images && step.images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {step.images.map((image, imgIndex) => (
                      <div key={imgIndex} className="rounded-lg overflow-hidden border border-gray-200">
                        <img 
                          src={image} 
                          alt={`${step.title} - 이미지 ${imgIndex + 1}`} 
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-bold text-gray-900">핵심 팁</h2>
          </div>

          <div className="space-y-3">
            {method.tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex gap-3 items-start"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-2.5 flex-shrink-0" />
                <p className="text-gray-700 leading-relaxed">{tip}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Wrench className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">사용 도구</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {method.tools.map((tool, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg font-medium text-sm border border-blue-200 hover:shadow-md transition-shadow"
              >
                {tool}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* References Section */}
        {method.references && method.references.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <ExternalLink className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">참고 자료</h2>
            </div>

            <div className="space-y-3">
              {method.references.map((reference, index) => (
                <motion.a
                  key={index}
                  href={reference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md hover:border-purple-300 transition-all group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <ExternalLink className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 group-hover:text-purple-700 transition-colors truncate">
                        {reference.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {reference.url}
                      </p>
                    </div>
                  </div>
                  <div className="ml-2 text-purple-600 group-hover:translate-x-1 transition-transform flex-shrink-0">
                    →
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-center text-white"
        >
          <h3 className="text-xl font-bold mb-2">이 가이드가 도움이 되셨나요?</h3>
          <p className="text-blue-100 mb-6">
            여러분의 노하우도 공유해주세요. 함께 성장하는 팀이 됩시다!
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            다른 가이드 보러가기
          </button>
        </motion.div>
      </div>
    </div>
  );
}