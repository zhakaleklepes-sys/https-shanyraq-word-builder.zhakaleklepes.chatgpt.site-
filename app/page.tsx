'use client';

import { useMemo, useState } from 'react';

type Mode = 'prefix' | 'suffix' | 'challenge';
type Part = { text: string; role: 'prefix' | 'root' | 'suffix' };
const prefixRoots = ['WRITE', 'READ', 'PLAY', 'USE', 'DO', 'BUILD', 'PAINT', 'START'];
const suffixRoots = ['KIND', 'HAPPY', 'SAD', 'DARK', 'WEAK', 'ILL', 'SOFT', 'FAIR', 'POLITE', 'FRIENDLY'];
const translations: Record<string, string> = {
  REWRITE:'қайта жазу', REREAD:'қайта оқу', REPLAY:'қайта ойнау', REUSE:'қайта пайдалану', REDO:'қайта жасау', REBUILD:'қайта құру', REPAINT:'қайта бояу', RESTART:'қайта бастау',
  KINDNESS:'мейірімділік', HAPPINESS:'бақыт', SADNESS:'мұң', DARKNESS:'қараңғылық', WEAKNESS:'әлсіздік', ILLNESS:'ауру', SOFTNESS:'жұмсақтық', FAIRNESS:'әділдік', POLITENESS:'сыпайылық', FRIENDLINESS:'достық, жылы қарым-қатынас',
};

function resultOf(parts: Part[]) {
  return `${parts.find(p=>p.role==='prefix')?.text ?? ''}${parts.find(p=>p.role==='root')?.text ?? ''}${parts.find(p=>p.role==='suffix')?.text ?? ''}`;
}

export default function Home() {
  const [mode, setMode] = useState<Mode>('prefix');
  const [parts, setParts] = useState<Part[]>([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Бөлшектерді таңдап, шаңыраққа орналастыр!');
  const [completed, setCompleted] = useState<string[]>([]);
  const roots = mode === 'prefix' ? prefixRoots : mode === 'suffix' ? suffixRoots : [...prefixRoots, ...suffixRoots];
  const choices = useMemo<Part[]>(() => {
    const affixes: Part[] = mode === 'prefix' ? [{text:'RE',role:'prefix'}] : mode === 'suffix' ? [{text:'NESS',role:'suffix'}] : [{text:'RE',role:'prefix'},{text:'NESS',role:'suffix'}];
    return [...affixes, ...roots.map(text=>({text,role:'root' as const}))];
  }, [mode, roots]);
  const word = resultOf(parts);

  function changeMode(next: Mode) { setMode(next); setParts([]); setMessage('Жаңа сөз құрастыр!'); }
  function addPart(part: Part) { setParts(current=>[...current.filter(p=>p.role!==part.role),part]); setMessage('Енді екінші бөлшекті таңда.'); }
  function checkWord() {
    if (translations[word]) {
      const isNew = !completed.includes(word);
      if (isNew) { setScore(s=>s+10); setCompleted(c=>[...c,word]); }
      setMessage(`Дұрыс! ${word} — ${translations[word]} ${isNew ? '+10 ұпай' : ''}`);
    } else setMessage('Тағы бір рет байқап көр. Бөлшектердің орнын тексер!');
  }

  return <main>
    <header className="topbar"><div className="brand-mark">Ш</div><div><p className="eyebrow">АҒЫЛШЫН ТІЛІ • 4-СЫНЫП</p><h1>SHAŃYRAQ <span>WORD BUILDER</span></h1></div><div className="score"><small>ҰПАЙ</small><strong>{score}</strong><span>★</span></div></header>
    <nav className="modes" aria-label="Ойын режимдері">
      <button className={mode==='prefix'?'active green':''} onClick={()=>changeMode('prefix')}><b>1</b> PREFIX <small>алдына</small></button>
      <button className={mode==='suffix'?'active blue':''} onClick={()=>changeMode('suffix')}><b>2</b> SUFFIX <small>соңына</small></button>
      <button className={mode==='challenge'?'active gold':''} onClick={()=>changeMode('challenge')}><b>★</b> CHALLENGE <small>аралас</small></button>
    </nav>
    <section className="game-layout">
      <aside className="lesson-card"><p className="eyebrow">БҮГІНГІ ЕРЕЖЕ</p>
        {mode==='prefix'&&<><h2><em>RE-</em> сөздің<br/>алдына қосылады</h2><div className="formula"><i>RE</i><span>+</span><b>WRITE</b></div><p>RE- әрекеттің қайта жасалғанын білдіреді.</p></>}
        {mode==='suffix'&&<><h2><em className="blue-text">-NESS</em> сөздің<br/>соңына қосылады</h2><div className="formula suffix"><b>KIND</b><span>+</span><i>NESS</i></div><p>-NESS қасиет немесе жағдай мағынасын береді.</p></>}
        {mode==='challenge'&&<><h2>Дұрыс бағытты<br/>өзің таңда!</h2><div className="formula"><i>RE</i><span>?</span><i className="blue-bg">NESS</i></div><p>Жаңа мағыналы сөз жасау үшін сәйкес бөлшектерді біріктір.</p></>}
        <div className="tip"><b>💡 Есіңде сақта</b><span>Prefix → BEFORE<br/>Suffix → AFTER</span></div>
      </aside>
      <section className="play-area"><div className="instruction"><span>👆</span><div><b>Жаңа сөз құрастыр</b><small>Төмендегі бөлшектерді таңда</small></div></div>
        <div className="shanyraq"><div className="outer-ring"><div className="cross one"/><div className="cross two"/><div className="inner-ring">
          {parts.length?<div className="built-word">{parts.some(p=>p.role==='prefix')&&<span className="piece prefix">RE</span>}{parts.some(p=>p.role==='root')?<span className="piece root">{parts.find(p=>p.role==='root')?.text}</span>:<span className="slot">WORD</span>}{parts.some(p=>p.role==='suffix')&&<span className="piece suffix">NESS</span>}</div>:<div className="empty-state"><span>＋</span><b>ОСЫ ЖЕРГЕ<br/>СӨЗ ҚҰРАСТЫР</b></div>}
        </div></div></div>
        <div className={`feedback ${translations[word]?'success':''}`} aria-live="polite">{message}</div><div className="actions"><button className="clear" onClick={()=>{setParts([]);setMessage('Қайтадан бастайық!')}}>Тазалау</button><button className="check" onClick={checkWord}>Тексеру ✓</button></div>
      </section>
      <aside className="parts-panel"><div className="parts-title"><p className="eyebrow">СӨЗ БӨЛШЕКТЕРІ</p><span>{choices.length}</span></div><p className="helper">Бөлшекті басып таңда</p><div className="chips">
        {choices.map(part=><button key={`${part.role}-${part.text}`} onClick={()=>addPart(part)} className={`chip ${part.role} ${parts.some(p=>p.role===part.role&&p.text===part.text)?'selected':''}`}><span className="ornament">◆</span>{part.role==='prefix'?`${part.text}-`:part.role==='suffix'?`-${part.text}`:part.text}</button>)}
      </div><div className="progress"><div><b>Жиналған сөздер</b><span>{completed.length} / {Object.keys(translations).length}</span></div><div className="bar"><i style={{width:`${completed.length/Object.keys(translations).length*100}%`}}/></div></div></aside>
    </section>
    <footer><span>ҚАЗАҚТЫҢ ШАҢЫРАҒЫ — БІРЛІК БЕЛГІСІ</span><b>Different parts come together to build one new word.</b></footer>
  </main>;
}
