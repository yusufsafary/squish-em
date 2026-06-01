import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "en" | "ja";

export const translations = {
  en: {
    // Nav
    navHome: "Home",
    navGuide: "Guide",
    navRoadmap: "Roadmap",
    navTech: "Tech",
    navAiAgent: "AI Agent",
    navChangelog: "Changelog",
    navPlayNow: "PLAY NOW",

    // PWA prompt
    pwaInstallApp: "INSTALL APP",
    pwaIosHint: (shareIcon: string) => `Tap ${shareIcon} Share, then Add to Home Screen to play offline.`,
    pwaAndroidHint: <>Play offline, full screen, <span className="text-primary font-semibold">without a browser</span>. Save to home screen.</>,
    pwaInstall: "INSTALL",
    pwaLater: "Later",
    pwaGotIt: "Got it",
    pwaClose: "Close",

    // Changelog
    changelogAll: "All",
    changelogGameplay: "Gameplay",
    changelogUi: "UI / Design",
    changelogBlockchain: "Blockchain",
    changelogSecurity: "🔒 Security",
    changelogFixes: "Bug Fixes",
    changelogDesc: "Latest updates summary. We improve every day.",
    changelogError: "Changelog unavailable. Please try again later.",
    changelogEmpty: "No updates in this category yet.",
    changelogUpdated: "Updated:",
    changelogAnd: "and",

    // Misc
    loading: "Loading Game",
  },
  ja: {
    // Nav
    navHome: "ホーム",
    navGuide: "ガイド",
    navRoadmap: "ロードマップ",
    navTech: "技術",
    navAiAgent: "AIエー��ェント",
    navChangelog: "更新履歴",
    navPlayNow: "プレイ",

    // PWA prompt
    pwaInstallApp: "アプリをインストール",
    pwaIosHint: (shareIcon: string) => `${shareIcon} 共有をタップして「ホーム画面に追加」を選択するとオフラインでプレイできます。`,
    pwaAndroidHint: <>オフラインでプレイ、フルスクリーン、<span className="text-primary font-semibold">ブラウザ不要</span>。ホーム画面に保存。</>,
    pwaInstall: "インストール",
    pwaLater: "後で",
    pwaGotIt: "わかった",
    pwaClose: "閉じる",

    // Changelog
    changelogAll: "すべて",
    changelogGameplay: "ゲームプレイ",
    changelogUi: "UI / デザイン",
    changelogBlockchain: "ブロックチェーン",
    changelogSecurity: "🔒 セキュリティ",
    changelogFixes: "バグ修正",
    changelogDesc: "最新のアップデート概要。毎日改善しています。",
    changelogError: "更新履歴を読み込めません。後でお試しください。",
    changelogEmpty: "このカテゴリに更新はまだありません。",
    changelogUpdated: "更新日時:",
    changelogAnd: "と",

    // Misc
    loading: "ゲームを読み込み中",
  },
} as const;

type Translations = typeof translations.en;

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const stored = (typeof window !== "undefined" ? localStorage.getItem("squish_lang") : null) as Lang | null;
  const [lang, setLangState] = useState<Lang>(stored ?? "en");

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("squish_lang", l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] as unknown as Translations }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
