'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { FileText, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * ArticleForm コンポーネントのプロパティ定義
 *
 * @interface ArticleFormProps
 */
interface ArticleFormProps {
  /**
   * 分析実行時のコールバック関数
   *
   * @param title - 記事タイトル
   * @param content - 記事本文
   */
  onAnalyze: (title: string, content: string) => void;

  /**
   * 分析中の状態フラグ
   * true の場合、ローディング表示とフォーム無効化を行う
   */
  isAnalyzing: boolean;

  /**
   * フォーム全体の無効化フラグ
   * true の場合、入力フィールドと送信ボタンを無効化
   */
  disabled?: boolean;
}

/**
 * バリデーションエラーの型定義
 */
interface ValidationErrors {
  title?: string;
  content?: string;
}

/**
 * フィールドの状態（未入力/有効/無効）
 */
type FieldStatus = 'idle' | 'valid' | 'invalid';

/**
 * ArticleForm - note記事のバイラル度分析用フォームコンポーネント
 *
 * @description
 * タイトルと本文を入力し、AI分析を実行するためのフォームコンポーネント。
 * リアルタイムバリデーション、文字数カウント、エラー表示機能を提供します。
 *
 * @component
 * @example
 * ```tsx
 * <ArticleForm
 *   onAnalyze={(title, content) => {
 *     console.log('Analyzing:', { title, content });
 *   }}
 *   isAnalyzing={false}
 *   disabled={false}
 * />
 * ```
 *
 * @param {ArticleFormProps} props - コンポーネントのプロパティ
 * @returns {React.ReactElement} ArticleFormコンポーネント
 *
 * @remarks
 * バリデーションルール:
 * - タイトル: 1-100文字
 * - 本文: 100-50000文字
 *
 * 機能:
 * - リアルタイム文字数カウント
 * - リアルタイムバリデーション
 * - 送信時の最終バリデーション
 * - ローディング状態の表示
 * - アクセシブルなエラーメッセージ
 */
export default function ArticleForm({
  onAnalyze,
  isAnalyzing,
  disabled = false,
}: ArticleFormProps): React.ReactElement {
  // フォームの状態管理
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ title: boolean; content: boolean }>({
    title: false,
    content: false,
  });

  // バリデーション定数
  const TITLE_MIN_LENGTH = 1;
  const TITLE_MAX_LENGTH = 100;
  const CONTENT_MIN_LENGTH = 100;
  const CONTENT_MAX_LENGTH = 50000;

  /**
   * タイトルのバリデーションを実行
   *
   * @param value - 検証するタイトル文字列
   * @returns バリデーションエラーメッセージ（エラーがない場合は undefined）
   */
  const validateTitle = useCallback((value: string): string | undefined => {
    if (value.length < TITLE_MIN_LENGTH) {
      return 'タイトルを入力してください';
    }
    if (value.length > TITLE_MAX_LENGTH) {
      return `タイトルは${TITLE_MAX_LENGTH}文字以内で入力してください`;
    }
    return undefined;
  }, []);

  /**
   * 本文のバリデーションを実行
   *
   * @param value - 検証する本文文字列
   * @returns バリデーションエラーメッセージ（エラーがない場合は undefined）
   */
  const validateContent = useCallback((value: string): string | undefined => {
    if (value.length < CONTENT_MIN_LENGTH) {
      return `本文は${CONTENT_MIN_LENGTH}文字以上で入力してください（現在: ${value.length}文字）`;
    }
    if (value.length > CONTENT_MAX_LENGTH) {
      return `本文は${CONTENT_MAX_LENGTH}文字以内で入力してください`;
    }
    return undefined;
  }, []);

  /**
   * タイトル変更ハンドラー
   * リアルタイムでバリデーションを実行
   */
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTitle(value);

      if (touched.title) {
        const error = validateTitle(value);
        setErrors((prev) => ({ ...prev, title: error }));
      }
    },
    [touched.title, validateTitle]
  );

  /**
   * 本文変更ハンドラー
   * リアルタイムでバリデーションを実行
   */
  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setContent(value);

      if (touched.content) {
        const error = validateContent(value);
        setErrors((prev) => ({ ...prev, content: error }));
      }
    },
    [touched.content, validateContent]
  );

  /**
   * フィールドのフォーカス喪失ハンドラー
   * タッチ状態を更新し、バリデーションを実行
   */
  const handleBlur = useCallback(
    (field: 'title' | 'content') => {
      setTouched((prev) => ({ ...prev, [field]: true }));

      if (field === 'title') {
        const error = validateTitle(title);
        setErrors((prev) => ({ ...prev, title: error }));
      } else {
        const error = validateContent(content);
        setErrors((prev) => ({ ...prev, content: error }));
      }
    },
    [title, content, validateTitle, validateContent]
  );

  /**
   * フォーム送信ハンドラー
   * 全フィールドのバリデーションを実行し、エラーがなければ分析を開始
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // 全フィールドをタッチ済みに設定
      setTouched({ title: true, content: true });

      // 最終バリデーション
      const titleError = validateTitle(title);
      const contentError = validateContent(content);

      setErrors({
        title: titleError,
        content: contentError,
      });

      // エラーがなければ分析を実行
      if (!titleError && !contentError) {
        onAnalyze(title, content);
      }
    },
    [title, content, validateTitle, validateContent, onAnalyze]
  );

  /**
   * フィールドのステータスを取得（アイコン表示用）
   */
  const getFieldStatus = useCallback(
    (field: 'title' | 'content'): FieldStatus => {
      if (!touched[field]) return 'idle';
      return errors[field] ? 'invalid' : 'valid';
    },
    [touched, errors]
  );

  /**
   * 文字数カウントのスタイルを計算
   * 制限に近づくにつれて警告色に変化
   */
  const getCharCountStyle = useCallback(
    (current: number, max: number): string => {
      const ratio = current / max;
      if (ratio >= 1.0) return 'text-red-600 font-semibold';
      if (ratio >= 0.9) return 'text-orange-600 font-medium';
      if (ratio >= 0.7) return 'text-yellow-600';
      return 'text-gray-500';
    },
    []
  );

  // フォーム無効化の判定
  const isFormDisabled = disabled || isAnalyzing;
  const hasErrors = Boolean(errors.title || errors.content);
  const canSubmit = title.length > 0 && content.length > 0 && !hasErrors && !isFormDisabled;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* タイトル入力フィールド */}
        <div className="space-y-2">
          <label
            htmlFor="article-title"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
          >
            記事タイトル
            <span className="text-red-500 ml-1" aria-label="必須">*</span>
          </label>

          <div className="relative">
            <input
              id="article-title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={() => handleBlur('title')}
              disabled={isFormDisabled}
              placeholder="魅力的なタイトルを入力してください..."
              maxLength={TITLE_MAX_LENGTH}
              className={`
                w-full px-4 py-3 pr-12
                text-base
                border-2 rounded-lg
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2
                disabled:bg-gray-100 disabled:cursor-not-allowed
                dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900
                ${
                  getFieldStatus('title') === 'invalid'
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : getFieldStatus('title') === 'valid'
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
                }
              `}
              aria-invalid={errors.title ? 'true' : 'false'}
              aria-describedby={errors.title ? 'title-error' : 'title-hint'}
            />

            {/* ステータスアイコン */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {getFieldStatus('title') === 'valid' && (
                <CheckCircle2 className="w-5 h-5 text-green-500" aria-hidden="true" />
              )}
              {getFieldStatus('title') === 'invalid' && (
                <AlertCircle className="w-5 h-5 text-red-500" aria-hidden="true" />
              )}
            </div>
          </div>

          {/* 文字数カウント */}
          <div className="flex justify-between items-center text-xs">
            <span
              id="title-hint"
              className="text-gray-500 dark:text-gray-400"
            >
              {TITLE_MIN_LENGTH}〜{TITLE_MAX_LENGTH}文字
            </span>
            <span
              className={getCharCountStyle(title.length, TITLE_MAX_LENGTH)}
              aria-live="polite"
            >
              {title.length} / {TITLE_MAX_LENGTH}
            </span>
          </div>

          {/* エラーメッセージ */}
          {errors.title && touched.title && (
            <p
              id="title-error"
              className="text-sm text-red-600 dark:text-red-400 flex items-start gap-1"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{errors.title}</span>
            </p>
          )}
        </div>

        {/* 本文入力フィールド */}
        <div className="space-y-2">
          <label
            htmlFor="article-content"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
          >
            記事本文
            <span className="text-red-500 ml-1" aria-label="必須">*</span>
          </label>

          <div className="relative">
            <textarea
              id="article-content"
              value={content}
              onChange={handleContentChange}
              onBlur={() => handleBlur('content')}
              disabled={isFormDisabled}
              placeholder="記事の本文を入力してください。より詳細な内容を入力することで、より正確な分析結果が得られます..."
              maxLength={CONTENT_MAX_LENGTH}
              rows={12}
              className={`
                w-full px-4 py-3
                text-base
                border-2 rounded-lg
                resize-y min-h-[12rem] max-h-[32rem]
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2
                disabled:bg-gray-100 disabled:cursor-not-allowed
                dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900
                ${
                  getFieldStatus('content') === 'invalid'
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : getFieldStatus('content') === 'valid'
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
                }
              `}
              aria-invalid={errors.content ? 'true' : 'false'}
              aria-describedby={errors.content ? 'content-error' : 'content-hint'}
            />

            {/* ステータスアイコン */}
            <div className="absolute right-3 top-3">
              {getFieldStatus('content') === 'valid' && (
                <CheckCircle2 className="w-5 h-5 text-green-500" aria-hidden="true" />
              )}
              {getFieldStatus('content') === 'invalid' && (
                <AlertCircle className="w-5 h-5 text-red-500" aria-hidden="true" />
              )}
            </div>
          </div>

          {/* 文字数カウント */}
          <div className="flex justify-between items-center text-xs">
            <span
              id="content-hint"
              className="text-gray-500 dark:text-gray-400"
            >
              {CONTENT_MIN_LENGTH.toLocaleString()}〜{CONTENT_MAX_LENGTH.toLocaleString()}文字
            </span>
            <span
              className={getCharCountStyle(content.length, CONTENT_MAX_LENGTH)}
              aria-live="polite"
            >
              {content.length.toLocaleString()} / {CONTENT_MAX_LENGTH.toLocaleString()}
            </span>
          </div>

          {/* エラーメッセージ */}
          {errors.content && touched.content && (
            <p
              id="content-error"
              className="text-sm text-red-600 dark:text-red-400 flex items-start gap-1"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{errors.content}</span>
            </p>
          )}
        </div>

        {/* 送信ボタン */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={!canSubmit}
            className={`
              px-8 py-4
              text-base font-semibold
              rounded-lg
              transition-all duration-200
              flex items-center gap-3
              shadow-lg hover:shadow-xl
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${
                canSubmit
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
              }
            `}
            aria-busy={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span>分析中...</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" aria-hidden="true" />
                <span>バイラル度を分析</span>
              </>
            )}
          </button>
        </div>

        {/* 分析中のヒント */}
        {isAnalyzing && (
          <div
            className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
              AI が記事を詳細に分析しています。数秒お待ちください...
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
