// Maataa Workstation's skills, run from the chat: call sheet, shot list,
// treatment, translate, summarize and slides. Call sheets and shot lists come
// back as MAATAA components; the rest as formatted text that can be kept as
// an artifact.
import { useEffect, useId, useState } from "react";
import {
  CallSheetPrintView,
  ChatMarkdown,
  ShotList,
  fromNovaCallSheet,
  fromNovaShotList,
  readNovaOutput,
  renderChatBlock,
  useT,
} from "@maataa/ui";
import { listSkills, runSkill, type Skill, type SkillRun } from "./workstation";

/** The skills shown here. Web fetch, file search and code lint stay on Workstation's own screen. */
const SHOWN = [
  "skl_callsheet",
  "skl_shotlist",
  "skl_treatment",
  "skl_translate",
  "skl_summarize",
  "skl_pptx",
];

const LANGUAGES = [
  "Hindi",
  "English",
  "Bengali",
  "Marathi",
  "Tamil",
  "Telugu",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Odia",
  "Urdu",
  "Sanskrit",
];

export function SkillsPanel({
  nova,
  model,
  sessionId,
  lastReply,
  onKeep,
}: {
  nova: "unknown" | "on" | "off";
  model: string;
  sessionId: string;
  lastReply: string;
  onKeep: (title: string, markdown: string) => void;
}) {
  const t = useT();
  const ids = {
    skill: useId(),
    text: useId(),
    lang: useId(),
    count: useId(),
    words: useId(),
    production: useId(),
  };
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [skillId, setSkillId] = useState("skl_callsheet");
  const [text, setText] = useState(lastReply);
  const [production, setProduction] = useState("");
  const [lang, setLang] = useState("Hindi");
  const [slides, setSlides] = useState(6);
  const [words, setWords] = useState(150);
  const [running, setRunning] = useState(false);
  const [run, setRun] = useState<SkillRun | null>(null);

  useEffect(() => {
    if (nova !== "on") return;
    let live = true;
    listSkills()
      .then((list) => live && setSkills(list.filter((s) => SHOWN.includes(s.id))))
      .catch((e: Error) => live && setError(e.message));
    return () => {
      live = false;
    };
  }, [nova]);

  if (nova !== "on")
    return (
      <p className="block-note pad">
        {t("Skills run in Maataa Workstation. Start it (port 8787), then come back here.")}
      </p>
    );
  if (error) return <p className="block-note pad">{error}</p>;
  if (!skills) return <p className="muted pad">{t("Asking Maataa Workstation for its skills…")}</p>;

  const skill = skills.find((s) => s.id === skillId) ?? skills[0];
  const go = async () => {
    if (!skill) return;
    setRunning(true);
    setError(null);
    setRun(null);
    const inputs: Record<string, unknown> = { text, modelId: model || undefined, sessionId };
    if (skill.id === "skl_translate") inputs.targetLang = lang;
    if (skill.id === "skl_pptx") inputs.slideCount = slides;
    if (skill.id === "skl_summarize") inputs.maxWords = words;
    if (production.trim() && ["skl_callsheet", "skl_shotlist", "skl_treatment"].includes(skill.id))
      inputs.production = production.trim();
    try {
      setRun(await runSkill(skill.id, inputs));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRunning(false);
    }
  };

  const markdown = run ? String(run.result.markdown ?? run.result.summary ?? "") : "";
  let drawn: JSX.Element | null = null;
  if (run?.result.data) {
    try {
      const out = readNovaOutput(run.result.data);
      drawn =
        out.kind === "callsheet" ? (
          <CallSheetPrintView {...fromNovaCallSheet(out.data)} />
        ) : (
          <ShotList {...fromNovaShotList(out.data)} />
        );
    } catch {
      drawn = null;
    }
  }

  return (
    <div className="pad stack">
      <div className="field">
        <label htmlFor={ids.skill}>{t("Skill")}</label>
        <select
          id={ids.skill}
          value={skill?.id}
          onChange={(e) => setSkillId(e.target.value)}
          disabled={running}
        >
          {skills.map((s) => (
            <option key={s.id} value={s.id}>
              {t(s.name)}
            </option>
          ))}
        </select>
        {skill?.description && (
          <p className="muted small" style={{ margin: 0 }}>
            {skill.description}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor={ids.text}>{t("Work from this text")}</label>
        <textarea
          id={ids.text}
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("Paste a script, notes or a schedule, or leave the last reply here.")}
          disabled={running}
        />
        {lastReply && text !== lastReply && (
          <button
            type="button"
            className="small-btn"
            style={{ justifySelf: "start" }}
            onClick={() => setText(lastReply)}
          >
            {t("Use the last reply")}
          </button>
        )}
      </div>
      {["skl_callsheet", "skl_shotlist", "skl_treatment"].includes(skill?.id ?? "") && (
        <div className="field">
          <label htmlFor={ids.production}>{t("Production name (optional)")}</label>
          <input
            id={ids.production}
            value={production}
            onChange={(e) => setProduction(e.target.value)}
            disabled={running}
          />
        </div>
      )}
      {skill?.id === "skl_translate" && (
        <div className="field">
          <label htmlFor={ids.lang}>{t("Into")}</label>
          <select id={ids.lang} value={lang} onChange={(e) => setLang(e.target.value)} disabled={running}>
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      )}
      {skill?.id === "skl_pptx" && (
        <div className="field">
          <label htmlFor={ids.count}>{t("Slides")}</label>
          <input
            id={ids.count}
            type="number"
            min={2}
            max={40}
            value={slides}
            onChange={(e) => setSlides(Number(e.target.value) || 6)}
            disabled={running}
          />
        </div>
      )}
      {skill?.id === "skl_summarize" && (
        <div className="field">
          <label htmlFor={ids.words}>{t("Length in words")}</label>
          <input
            id={ids.words}
            type="number"
            min={30}
            max={1000}
            value={words}
            onChange={(e) => setWords(Number(e.target.value) || 150)}
            disabled={running}
          />
        </div>
      )}
      <div className="inline">
        <button
          type="button"
          className="primary"
          onClick={() => void go()}
          disabled={running || !text.trim()}
        >
          {running ? t("Working…") : t("Run {name}", { name: t(skill?.name ?? "") })}
        </button>
        {running && (
          <span role="status" className="small muted">
            {t("The model is writing; this can take a minute.")}
          </span>
        )}
      </div>
      {error && (
        <p role="alert" className="block-note tone-error">
          {error}
        </p>
      )}
      {run && (
        <section className="stack" aria-label={t("Result")}>
          <div className="inline">
            <strong style={{ flex: 1 }}>{t("Result")}</strong>
            {markdown && (
              <button
                type="button"
                onClick={() => onKeep(`${t(skill?.name ?? "")}: ${production || t("result")}`, markdown)}
              >
                {t("Keep as artifact")}
              </button>
            )}
          </div>
          {drawn ? (
            <div style={{ overflowX: "auto" }} tabIndex={0} role="region" aria-label={t(skill?.name ?? "")}>
              <div style={{ minWidth: 560 }}>{drawn}</div>
            </div>
          ) : markdown ? (
            <ChatMarkdown renderBlock={(b) => renderChatBlock(b)}>{markdown}</ChatMarkdown>
          ) : (
            <p className="muted">{t("The skill finished but returned nothing to show.")}</p>
          )}
          {run.output?.libraryPath && (
            <p className="muted small" style={{ margin: 0 }}>
              {t("Also saved in Workstation’s Library: {path}", { path: run.output.libraryPath })}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
