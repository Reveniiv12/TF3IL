import React, { useState } from 'react';

const REASONS = [
  "سلبيات و ايجابيات غير مطابقة بالقصة",
  "تحديد مسار عاطفي",
  "تحديد مسار تجاري",
  "حدث واحد فقط",
  "لا يوجد أحداث بالقصة",
  "لا يوجد أحداث بالطفولة",
  "لا يوجد عمر محدد للأحداث",
  "قصة سيئة",
  "مسار إجرامي",
  "مايك سيئ جداً",
  "مسار عسكري",
  "مسار قطاع العدل",
  "مسار الصحة"
];

function App() {
  const [activeTab, setActiveTab] = useState('reject');
  const [acceptFormData, setAcceptFormData] = useState({
    discordId: '',
    story: '',
    note: '',
    instant: false
  });

  const [formData, setFormData] = useState({
    name: '',
    birthDay: '01',
    birthMonth: '01',
    birthYear: '2000',
    discordId: '',
    reason: REASONS[0],
    story: '',
    note: '',
    attemptNumber: '',
    stolenFromId: '',
    banDuration: '',
    stolenStory: '',
    copyLink: '',
    checks: {
      instant: false,
      storyCopy: false,
      aiBand: false
    }
  });

  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatDateStr = () => {
    return `${formData.birthDay}/${formData.birthMonth}/${formData.birthYear}`;
  };

  const generateAINote = () => {
    setGenerating(true);
    setTimeout(() => {
      const AI_TEMPLATES = {
        "سلبيات و ايجابيات غير مطابقة بالقصة": [
          "يلاحظ المنسق تناقضاً واضحاً بين السلبيات المذكورة وتصرفات الشخصية في القصة، يرجى إعادة صياغتها لتكون أكثر ترابطاً.",
          "السلبيات والايجابيات لا تدعم دوافع الشخصية المذكورة في القصة، نرجو التركيز على التناسق النفسي للبناء الشخصي."
        ],
        "تحديد مسار عاطفي": [
          "القصة تميل بشكل كبير للمصار العاطفي المبالغ فيه، يجب أن تكون الأحداث أكثر واقعية وتوازناً في السرد الدرامي.",
          "نبهنا اللاعب إلى أن المسارات العاطفية المفرطة قد تؤثر على جودة الرول بلاي، نوصي بتقديمه لحدث واقعي ملموس."
        ],
        "مايك سيئ جداً": [
          "اللاعب يحتاج لتعديل إعدادات الميكروفون أو استبداله؛ حيث يوجد تشويش كبير يمنع فهم الكلمات بوضوح.",
          "جودة الصوت الحالية لا تسمح بالاستمرار، تم توجيه اللاعب لتحسين الصوت قبل التقديم مرة أخرى."
        ],
        "لا يوجد أحداث بالقصة": [
          "القصة تفتقر للحبكة الأساسية والأحداث المحركة للشخصية، نوصي بإضافة حدث جوهري غير مسار حياة الشخصية.",
          "تم رصد غياب للأحداث الزمنية المتسلسلة، القصة عبارة عن وصف فقط دون وقائع حقيقية."
        ],
        "قصة سيئة": [
          "افتقار السرد للحبكة الدرامية وتداخل الأحداث بشكل مربك، يحتاج اللاعب لتحسين مهارات السرد الكتابي.",
          "القصة قصيرة جداً ولا تعكس خلفية غنية للشخصية، تم توجيه اللاعب لمراجعة أساسيات كتابة السيناريو."
        ],
        "default": [
          "تم توجيه اللاعب بضرورة مراجعة قوانين المدينة والتركيز على واقعية الرول بلاي في المرة القادمة.",
          "يُنصح اللاعب بمشاهدة بعض الشروحات حول كيفية بناء شخصية متكاملة قبل تقديم النموذج مجدداً."
        ]
      };

      const templates = AI_TEMPLATES[formData.reason] || AI_TEMPLATES["default"];
      const randomNote = templates[Math.floor(Math.random() * templates.length)];
      
      setFormData(prev => ({ ...prev, note: randomNote }));
      setGenerating(false);
    }, 900);
  };

  const getActiveChecks = () => {
    const list = [];
    if (formData.checks.instant) list.push("رفض تفعيل فوري");
    if (formData.checks.storyCopy) list.push("باند تفعيل نسخ قصه");
    if (formData.checks.aiBand) list.push("باند تفعيل ذكاء اصطناعي");
    return list.length > 0 ? `**النوع: ${list.join(" - ")}**\n` : "";
  };

  const extraInfo = [];
  if (formData.checks.instant && formData.attemptNumber) extraInfo.push(`**رقم المحاولة:** ${formData.attemptNumber}`);
  if (formData.checks.storyCopy && formData.stolenFromId) extraInfo.push(`**ايدي الشخص المسروق منه:** <@${formData.stolenFromId}>`);
  if ((formData.checks.storyCopy || formData.checks.aiBand) && formData.banDuration) extraInfo.push(`**مدة الباند:** ${formData.banDuration}`);
  if (formData.checks.aiBand && formData.copyLink) extraInfo.push(`**الرابط:** ${formData.copyLink}`);
  
  const extraInfoStr = extraInfo.length > 0 ? extraInfo.join('\n') + '\n' : '';
  const stolenStorySection = formData.checks.storyCopy && formData.stolenStory ? `\n***قصة الشخص المسروق منه***\n${formData.stolenStory}` : '';

  const generatedText = `${getActiveChecks()}<@${formData.discordId || '0000000000'}>
**الاسم:${formData.name || '---'}**
\`تاريخ الميلاد :${formatDateStr()}\`
${extraInfoStr}***سبب الرفض***
*${formData.reason}*
***القصه***
${formData.story || '---'}${stolenStorySection}

**ملاحظه:**: ${formData.note || '---'}`;

  const generatedAcceptText = `<@${acceptFormData.discordId || '0000000000'}>
***القصه***
${acceptFormData.story || '---'}

**ملاحظه:**: ${acceptFormData.note || '---'}
** تم تنبيه عن العلاقات و التلميحات تعرضه للمحاسبة و في حال مخالفته القوانين سيتعرض للباند أو اعادة التفعيل**
** تم تنبية بخصوص صناع المحتوى**${acceptFormData.instant ? '\n\n** تفعيل فوري**' : ''}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeTab === 'reject' ? generatedText : generatedAcceptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('فشل في النسخ، يرجى المحاولة يدوياً');
    }
  };

  const toggleCheck = (key) => {
    setFormData(prev => ({
      ...prev,
      checks: { ...prev.checks, [key]: !prev.checks[key] }
    }));
  };

  return (
    <div className="layout-wrapper">
      <div className="modal-card">
        {/* Panel 1: Form Inputs (Right side on PC) */}
        <div className="inputs-panel">
          <div className="logo-header">
            <div className="logo-hexagon">
              <svg width="35" height="35" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
          </div>
          
          <h2 className="panel-title">{activeTab === 'reject' ? 'قسم الرفض' : 'قسم القبول'}</h2>

          <div className="tabs-container">
            <button className={`tab-btn ${activeTab === 'reject' ? 'active' : ''}`} onClick={() => setActiveTab('reject')}>قسم الرفض</button>
            <button className={`tab-btn ${activeTab === 'accept' ? 'active' : ''}`} onClick={() => setActiveTab('accept')}>قسم القبول</button>
          </div>

          {activeTab === 'reject' ? (
            <>
              <div className="checkbox-group">
                <div className="checkbox-item" onClick={() => toggleCheck('instant')}>
                  <div className={`custom-checkbox ${formData.checks.instant ? 'checked' : ''}`}>{formData.checks.instant && '✓'}</div>
                  <span>رفض تفعيل فوري</span>
                </div>
                <div className="checkbox-item" onClick={() => toggleCheck('storyCopy')}>
                  <div className={`custom-checkbox ${formData.checks.storyCopy ? 'checked' : ''}`}>{formData.checks.storyCopy && '✓'}</div>
                  <span>باند تفعيل نسخ قصه</span>
                </div>
                <div className="checkbox-item" onClick={() => toggleCheck('aiBand')}>
                  <div className={`custom-checkbox ${formData.checks.aiBand ? 'checked' : ''}`}>{formData.checks.aiBand && '✓'}</div>
                  <span>باند تفعيل ذكاء اصطناعي</span>
                </div>
              </div>

              <div className="input-stack">
                <input type="text" className="main-input" placeholder="الاسم الكامل" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                
                <div className="date-dropdown-group">
                  <select className="date-select" value={formData.birthDay} onChange={(e) => setFormData({...formData, birthDay: e.target.value})}>
                    {Array.from({length: 31}, (_, i) => String(i+1).padStart(2, '0')).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select className="date-select" value={formData.birthMonth} onChange={(e) => setFormData({...formData, birthMonth: e.target.value})}>
                    {Array.from({length: 12}, (_, i) => String(i+1).padStart(2, '0')).map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select className="date-select" value={formData.birthYear} onChange={(e) => setFormData({...formData, birthYear: e.target.value})}>
                    {Array.from({length: 80}, (_, i) => 2026 - i).map(y => <option key={y} value={String(y)}>{y}</option>)}
                  </select>
                </div>

                <input type="text" className="main-input" placeholder="Discord ID (copy id)" value={formData.discordId} onChange={(e) => setFormData({...formData, discordId: e.target.value})} />
                
                {formData.checks.instant && (
                  <input type="text" className="main-input" placeholder="اكتب رقم المحاولة" value={formData.attemptNumber} onChange={(e) => setFormData({...formData, attemptNumber: e.target.value})} />
                )}

                {formData.checks.storyCopy && (
                  <input type="text" className="main-input" placeholder="copy id الشخص المسروقه منه" value={formData.stolenFromId} onChange={(e) => setFormData({...formData, stolenFromId: e.target.value})} />
                )}

                {formData.checks.aiBand && (
                  <input type="text" className="main-input" placeholder="كوبي لنك" value={formData.copyLink} onChange={(e) => setFormData({...formData, copyLink: e.target.value})} />
                )}

                {(formData.checks.storyCopy || formData.checks.aiBand) && (
                  <input type="text" className="main-input" placeholder="مده الباند" value={formData.banDuration} onChange={(e) => setFormData({...formData, banDuration: e.target.value})} />
                )}

                <select className="main-input" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})}>
                  {REASONS.map((r, i) => <option key={r} value={r}>{r}</option>)}
                </select>

                <textarea className="main-input" placeholder="الصق القصه الشخصية هنا..." rows="2" value={formData.story} onChange={(e) => setFormData({...formData, story: e.target.value})}></textarea>

                {formData.checks.storyCopy && (
                  <textarea className="main-input" placeholder="الصق القصه الشخص المسروقه منه" rows="2" value={formData.stolenStory} onChange={(e) => setFormData({...formData, stolenStory: e.target.value})}></textarea>
                )}

                <div className="input-container">
                  <button className="ai-btn-small" onClick={generateAINote}>{generating ? 'جاري...' : '✨ تحسين بالذكاء'}</button>
                  <textarea className="main-input" placeholder="هل يوجد أي ملاحظة للمنسق؟" rows="2" value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})}></textarea>
                </div>
              </div>
            </>
          ) : (
            <div className="input-stack">
              <div className="checkbox-group" style={{justifyContent: 'center', marginBottom: '10px'}}>
                <div className="checkbox-item" onClick={() => setAcceptFormData(prev => ({...prev, instant: !prev.instant}))}>
                  <div className={`custom-checkbox ${acceptFormData.instant ? 'checked' : ''}`}>{acceptFormData.instant && '✓'}</div>
                  <span>تفعيل فوري</span>
                </div>
              </div>
              
              <input type="text" className="main-input" placeholder="Discord ID (copy id)" value={acceptFormData.discordId} onChange={(e) => setAcceptFormData({...acceptFormData, discordId: e.target.value})} />
              
              <textarea className="main-input" placeholder="الصق القصه الشخصية هنا..." rows="6" value={acceptFormData.story} onChange={(e) => setAcceptFormData({...acceptFormData, story: e.target.value})}></textarea>
              
              <textarea className="main-input" placeholder="ملاحظة للمنسق (اختياري)" rows="2" value={acceptFormData.note} onChange={(e) => setAcceptFormData({...acceptFormData, note: e.target.value})}></textarea>
            </div>
          )}
          
          <button className="submit-btn" onClick={handleCopy}>
            {copied ? 'تم النسخ بنجاح!' : 'نسخ التنسيق النهائي'}
          </button>
        </div>

        {/* Panel 2: Live Preview (Left side on PC / Bottom on Mobile) */}
        <div className="preview-panel">
          <div className="preview-header">
            <h3>المعاينة المباشرة</h3>
            <div className="discord-status">متصل حالياً</div>
          </div>
          
          <div className="discord-preview-container">
            <div className="discord-msg">
              <div className="discord-avatar">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
              </div>
              <div className="discord-body">
                <div className="discord-user">System Bot <span className="bot-tag">BOT</span></div>
                <div className="discord-text">{activeTab === 'reject' ? generatedText : generatedAcceptText}</div>
              </div>
            </div>
          </div>
          
          <p className="preview-hint">هذا هو الشكل النهائي الذي سيظهر في الديسكورد.</p>
        </div>
      </div>

      <style>{`
        .layout-wrapper { 
          width: 100%; 
          display: flex; 
          justify-content: center; 
          padding: 3rem 1.5rem; 
          min-height: 100vh;
          align-items: flex-start;
        }
        
        .modal-card { 
          width: 100%; 
          max-width: 1180px; 
          display: grid; 
          grid-template-columns: 1.1fr 1fr; /* Inputs Right, Preview Left in RTL */
          background: #2b2d31; 
          border-radius: 32px; 
          overflow: hidden; 
          box-shadow: 0 50px 120px rgba(0,0,0,0.7); 
          border: 1px solid rgba(255, 255, 255, 0.05);
          height: 85vh;
          min-height: 650px;
        }

        .inputs-panel { 
          padding: 3rem 2.5rem; 
          background: var(--card-bg); 
          display: flex; 
          flex-direction: column; 
          gap: 1.8rem;
          height: 100%;
          overflow-y: auto;
        }

        .preview-panel { 
          padding: 3rem; 
          display: flex; 
          flex-direction: column; 
          gap: 2rem; 
          background: #2b2d31; 
          height: 100%;
          overflow-y: auto;
          border-right: 1px solid rgba(255,255,255,0.05);
        }

        /* Custom Scrollbar */
        .inputs-panel::-webkit-scrollbar, .preview-panel::-webkit-scrollbar { width: 6px; }
        .inputs-panel::-webkit-scrollbar-track { background: transparent; }
        .inputs-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .inputs-panel::-webkit-scrollbar-thumb:hover { background: var(--accent); }

        .input-stack { display: flex; flex-direction: column; gap: 1.2rem; }
        .tabs-container { display: flex; gap: 1rem; margin-bottom: 1.5rem; justify-content: center; }
        .tab-btn { flex: 1; padding: 0.8rem; border-radius: 12px; border: none; background: rgba(255,255,255,0.05); color: white; cursor: pointer; font-weight: bold; transition: all 0.3s; font-size: 1rem; }
        .tab-btn:hover { background: rgba(255,255,255,0.1); }
        .tab-btn.active { background: var(--accent, #7c3aed); box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4); }
        .panel-title { font-size: 2.2rem; font-weight: 900; color: var(--accent); margin-bottom: 0.5rem; text-align: center; }
        
        .preview-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1.2rem; }
        .discord-status { font-size: 0.85rem; color: #3ba55c; display: flex; align-items: center; gap: 6px; }
        .discord-status::before { content: ''; width: 10px; height: 10px; background: #3ba55c; border-radius: 50%; display: inline-block; }
        
        .discord-msg { display: flex; gap: 1rem; direction: ltr; margin-top: 1rem; }
        .discord-avatar { width: 48px; height: 48px; border-radius: 50%; background: #5865f2; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .discord-user { color: #fff; font-weight: 700; display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 1.05rem; }
        .bot-tag { background: #5865f2; color: white; font-size: 0.65rem; padding: 2px 5px; border-radius: 4px; font-weight: 800; }
        .discord-text { color: #dbdee1; white-space: pre-wrap; direction: rtl; text-align: right; line-height: 1.6; font-size: 0.95rem; }
        .preview-hint { color: rgba(255,255,255,0.25); font-size: 0.85rem; text-align: center; margin-top: 2rem; }

        .input-container { position: relative; width: 100%; }
        .ai-btn-small { 
          position: absolute; top: -0.8rem; left: 0.8rem; z-index: 10;
          background: #7c3aed; color: white; border: none; padding: 0.3rem 0.8rem;
          border-radius: 8px; font-size: 0.75rem; cursor: pointer; font-weight: 700;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        @media (max-width: 1024px) {
          .layout-wrapper { padding: 1.5rem 0.5rem; }
          .modal-card { grid-template-columns: 1fr; border-radius: 24px; gap: 1.5rem; background: transparent; box-shadow: none; border: none; height: auto; overflow: visible; }
          .inputs-panel, .preview-panel { 
            background: var(--card-bg); border-radius: 24px; padding: 2rem 1.2rem;
            border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            height: auto; overflow: visible; /* No Internal Scroll on Mobile */
          }
          .preview-panel { min-height: auto; padding-bottom: 3rem; }
          .panel-title { font-size: 1.7rem; }
        }
      `}</style>
    </div>
  );
}

export default App;
