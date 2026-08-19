import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight, Box, Building2, Check, ChevronDown, ClipboardCheck,
  Headphones, HeartHandshake, Home, Menu, MessageCircle, ShieldCheck,
  Sparkles, SprayCan, Trash2, X
} from 'lucide-react'
import './styles.css'

const services = [
  { icon: Home, no: '01', title: '쓰레기집 청소', copy: '쌓인 물건의 분류부터 반출, 세척까지 한 번에 진행합니다.' },
  { icon: ShieldCheck, no: '02', title: '특수청소', copy: '오염 범위를 확인하고 공간에 맞는 약품과 장비로 복원합니다.' },
  { icon: Box, no: '03', title: '유품정리', copy: '남겨야 할 것과 정리할 것을 충분히 상의해 조심스럽게 구분합니다.' },
  { icon: SprayCan, no: '04', title: '악취·오염 제거', copy: '표면만 덮지 않고 냄새와 오염의 원인을 찾아 단계별로 처리합니다.' },
  { icon: Trash2, no: '05', title: '폐기물 처리', copy: '분류와 반출 동선을 계획해 주변 불편을 줄이고 깔끔하게 마무리합니다.' },
  { icon: Building2, no: '06', title: '원상복구', copy: '퇴거·이사·사업장 정리 후 다시 사용할 수 있는 상태로 회복합니다.' },
]

const principles = [
  ['01', '비밀 보장', '상담 내용과 현장 상황을 외부에 드러내지 않습니다.'],
  ['02', '현장 맞춤 견적', '사진과 상담으로 범위를 파악하고, 작업 전 내용을 분명히 안내합니다.'],
  ['03', '책임 작업', '분류·반출·세척·탈취의 전 과정을 하나의 기준으로 관리합니다.'],
  ['04', '안전한 마무리', '작업 후 확인까지 마친 뒤 공간을 돌려드립니다.'],
]

const steps = [
  ['01', '비공개 상담', '사진과 함께 현재 상황, 원하는 일정, 꼭 보관할 물건을 알려주세요.'],
  ['02', '범위 확인', '오염도와 반출량, 작업 동선을 확인해 작업 범위를 안내합니다.'],
  ['03', '집중 작업', '주변 노출을 최소화하고 분류, 반출, 세척, 탈취를 진행합니다.'],
  ['04', '최종 확인', '놓친 부분이 없는지 함께 확인하고 작업 내용을 정리해드립니다.'],
]

const faqs = [
  ['이웃에게 알려질까 걱정돼요.', '현장 출입과 반출 동선을 가능한 한 조용하게 계획합니다. 상담 내용과 작업 사유도 외부에 공유하지 않습니다.'],
  ['사진만으로도 상담할 수 있나요?', '네. 공간 전체와 오염이 심한 부분, 반출할 물건의 양이 보이는 사진을 보내주시면 1차 범위를 확인할 수 있습니다.'],
  ['제가 현장에 계속 있어야 하나요?', '첫 확인과 보관 물품 협의가 끝나면 작업 중 계속 머무르지 않으셔도 됩니다. 최종 확인 방식은 미리 정합니다.'],
  ['어떤 공간까지 작업하나요?', '주거 공간뿐 아니라 사무실, 상가, 창고 등도 상담할 수 있습니다. 공간과 작업 범위에 따라 일정을 안내합니다.'],
]

function Brand({ light = false }) {
  return <a className={`brand ${light ? 'light' : ''}`} href="#top" aria-label="위대한 청소부 홈">
    <span className="brand-mark" aria-hidden="true"><span>W</span><i /></span>
    <span className="brand-name"><b>위대한 청소부</b><small>공간을 되살리는 기술</small></span>
  </a>
}

function Header({ onConsult }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [])
  return <header className="site-header">
    <Brand light />
    <nav className="desktop-nav" aria-label="주요 메뉴">
      <a href="#services">서비스</a><a href="#promise">작업 원칙</a><a href="#process">진행 과정</a><a href="#faq">자주 묻는 질문</a>
    </nav>
    <button className="header-cta" onClick={onConsult}>비공개 상담 <ArrowRight size={16}/></button>
    <button className="menu-button" onClick={() => setOpen(v => !v)} aria-label="메뉴 열기" aria-expanded={open}>{open ? <X/> : <Menu/>}</button>
    <AnimatePresence>{open && <motion.nav className="mobile-nav" initial={{opacity:0, y:-12}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-12}}>
      <a onClick={() => setOpen(false)} href="#services">서비스</a><a onClick={() => setOpen(false)} href="#promise">작업 원칙</a><a onClick={() => setOpen(false)} href="#process">진행 과정</a><a onClick={() => setOpen(false)} href="#faq">자주 묻는 질문</a>
      <button onClick={() => { setOpen(false); onConsult() }}>비공개 상담하기</button>
    </motion.nav>}</AnimatePresence>
  </header>
}

const reveal = { initial: { opacity: 0, y: 34 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' }, transition: { duration: .75, ease: [0.22, 1, 0.36, 1] } }

function App() {
  const [consult, setConsult] = useState(false)
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({ type: '쓰레기집 청소', area: '', date: '', note: '' })
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 800], [0, 100])

  const copyRequest = async (e) => {
    e.preventDefault()
    const text = `[위대한 청소부 상담 요청]\n서비스: ${form.type}\n지역: ${form.area || '미입력'}\n희망 일정: ${form.date || '협의'}\n내용: ${form.note || '상담 시 전달'}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
  }

  return <div id="top">
    <Header onConsult={() => setConsult(true)} />
    <main>
      <section className="hero">
        <motion.div className="hero-image" style={{ y: heroY }} />
        <div className="hero-shade" />
        <motion.div className="hero-copy" initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{duration:1, delay:.25}}>
          <span className="eyebrow light">GREAT CLEANER · SPECIAL CARE</span>
          <h1>공간이 다시<br/><em>일상이 되도록.</em></h1>
          <p>말하기 어려운 상황일수록 조용하고 정확하게.<br/>정리부터 세척, 탈취, 마무리까지 책임집니다.</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => setConsult(true)}>비공개 상담 시작 <ArrowRight size={18}/></button>
            <a href="#services">서비스 보기 <ChevronDown size={17}/></a>
          </div>
        </motion.div>
        <div className="hero-note"><span>24H</span><p>상담 요청서 작성 가능<br/><small>확인 후 순차 안내</small></p></div>
        <div className="scroll-cue"><i/> SCROLL TO RESTORE</div>
      </section>

      <section className="intro section-pad">
        <motion.div {...reveal} className="intro-head">
          <span className="eyebrow">WHY GREAT CLEANER</span>
          <h2>치우는 일보다 중요한 건,<br/><em>다시 살아갈 수 있게 하는 일.</em></h2>
        </motion.div>
        <motion.div {...reveal} className="intro-copy">
          <p>누구에게나 혼자 감당하기 어려운 순간이 있습니다. 위대한 청소부는 현장을 평가하거나 재촉하지 않습니다. 필요한 일을 정확히 나누고, 고객님의 속도에 맞춰 공간을 되돌립니다.</p>
          <div><strong>상담부터 마무리까지</strong><span>한 번의 설명으로 이어지는 책임 작업</span></div>
        </motion.div>
      </section>

      <section id="services" className="services section-pad">
        <motion.div {...reveal} className="section-title">
          <span className="eyebrow">OUR SERVICES</span><h2>상황에 맞는<br/>정확한 해결</h2><p>필요한 작업만 선별해 공간별로 진행합니다.</p>
        </motion.div>
        <div className="service-list">
          {services.map(({icon:Icon, no, title, copy}, i) => <motion.article key={title} {...reveal} transition={{...reveal.transition, delay:i*.05}}>
            <span className="service-no">{no}</span><Icon strokeWidth={1.5}/><div><h3>{title}</h3><p>{copy}</p></div><ArrowRight className="service-arrow"/>
          </motion.article>)}
        </div>
      </section>

      <section id="promise" className="promise">
        <div className="promise-photo"><img src="/images/detail-sanitation.png" alt="전문 장비로 주방을 세척하는 작업자" loading="lazy"/><span>DETAIL MAKES<br/>THE DIFFERENCE.</span></div>
        <div className="promise-content">
          <motion.div {...reveal}><span className="eyebrow light">OUR STANDARD</span><h2>보이지 않는 곳까지<br/><em>기준 있게.</em></h2><p className="lead">현장마다 상태는 달라도, 지켜야 할 원칙은 같습니다.</p></motion.div>
          <div className="principle-list">{principles.map(([no,title,copy]) => <motion.div {...reveal} key={no}><span>{no}</span><h3>{title}</h3><p>{copy}</p><Check/></motion.div>)}</div>
        </div>
      </section>

      <section id="process" className="process section-pad">
        <motion.div {...reveal} className="section-title horizontal"><div><span className="eyebrow">HOW WE WORK</span><h2>막막한 시작을<br/>단순한 순서로</h2></div><p>처음부터 모든 것을 결정할 필요는 없습니다.<br/>한 단계씩 함께 확인합니다.</p></motion.div>
        <div className="steps">{steps.map(([no,title,copy], i) => <motion.article {...reveal} key={no}><span>{no}</span><div className="step-line"><i/><b>{i+1}</b></div><h3>{title}</h3><p>{copy}</p></motion.article>)}</div>
      </section>

      <section className="care-story">
        <div className="care-copy">
          <motion.div {...reveal}><HeartHandshake/><span className="eyebrow">RESPECTFUL CARE</span><h2>물건을 정리하지만,<br/>마음은 서두르지 않습니다.</h2><p>유품과 생활 물품은 고객님과 기준을 먼저 정합니다. 남겨야 할 기억이 폐기물과 섞이지 않도록 분류하고 확인합니다.</p><button className="text-button" onClick={() => setConsult(true)}>유품정리 상담하기 <ArrowRight/></button></motion.div>
        </div>
        <div className="care-photo"><img src="/images/estate-care.png" alt="유품을 조심스럽게 분류하는 작업자" loading="lazy"/></div>
      </section>

      <section className="proof section-pad">
        <motion.div {...reveal} className="proof-quote"><Sparkles/><blockquote>“처음 연락하는 순간부터<br/>다시 문을 여는 순간까지.”</blockquote><p>현장을 숨기고 싶은 마음도, 어디서부터 시작해야 할지 모르는 마음도 이해합니다.</p></motion.div>
        <div className="proof-points">
          <div><Headphones/><strong>상담 내용 보호</strong><span>민감한 상황을 조심스럽게 듣습니다.</span></div>
          <div><ClipboardCheck/><strong>작업 범위 사전 확인</strong><span>진행 전 필요한 작업을 나눠 설명합니다.</span></div>
          <div><ShieldCheck/><strong>전문 장비와 약품</strong><span>공간과 오염 상태에 맞게 선택합니다.</span></div>
        </div>
      </section>

      <section id="faq" className="faq section-pad">
        <div className="section-title"><span className="eyebrow">BEFORE YOU ASK</span><h2>상담 전,<br/>많이 묻는 질문</h2></div>
        <div className="faq-list">{faqs.map(([q,a],i) => <Faq key={q} q={q} a={a} index={i}/>)}</div>
      </section>

      <section className="final-cta">
        <div className="final-bg"/>
        <motion.div {...reveal}><span className="eyebrow light">START YOUR RESTORATION</span><h2>지금의 모습이<br/>당신의 전부는 아닙니다.</h2><p>사진 몇 장과 짧은 설명이면 충분합니다.<br/>가능한 방법부터 차분히 찾아드리겠습니다.</p><button className="primary inverse" onClick={() => setConsult(true)}>상담 요청서 작성 <MessageCircle size={19}/></button></motion.div>
      </section>
    </main>
    <footer><div><Brand light/><p>어려운 공간을 다시 일상으로 되돌리는 특수청소 서비스</p></div><div className="footer-links"><a href="#services">서비스</a><a href="#promise">작업 원칙</a><a href="#process">진행 과정</a><a href="#faq">FAQ</a></div><div className="footer-meta"><p>상담 지역 및 일정은 요청서 확인 후 안내드립니다.</p><span>© 2026 위대한 청소부. All rights reserved.</span></div></footer>
    <button className="floating-consult" onClick={() => setConsult(true)}><MessageCircle/><span>상담하기</span></button>
    <AnimatePresence>{consult && <ConsultModal form={form} setForm={setForm} copied={copied} onSubmit={copyRequest} onClose={() => {setConsult(false); setCopied(false)}}/>}</AnimatePresence>
  </div>
}

function Faq({ q, a, index }) {
  const [open, setOpen] = useState(index === 0)
  return <div className={`faq-item ${open ? 'open' : ''}`}><button onClick={() => setOpen(v => !v)}><span>0{index+1}</span><b>{q}</b><ChevronDown/></button><AnimatePresence initial={false}>{open && <motion.p initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}>{a}</motion.p>}</AnimatePresence></div>
}

function ConsultModal({ form, setForm, copied, onSubmit, onClose }) {
  useEffect(() => { document.body.style.overflow='hidden'; return () => document.body.style.overflow='' }, [])
  return <motion.div className="modal-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={onClose}>
    <motion.div className="modal" initial={{opacity:0, y:30, scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:20}} onMouseDown={e=>e.stopPropagation()}>
      <button className="modal-close" onClick={onClose} aria-label="닫기"><X/></button>
      <span className="eyebrow">PRIVATE CONSULTATION</span><h2>상담 요청서</h2><p>입력한 내용은 서버로 전송되지 않습니다. 요청서를 복사해 사용 중인 문자나 메신저로 안전하게 전달할 수 있습니다.</p>
      <form onSubmit={onSubmit}>
        <label>필요한 서비스<select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{services.map(s=><option key={s.title}>{s.title}</option>)}</select></label>
        <div className="form-row"><label>지역<input value={form.area} onChange={e=>setForm({...form,area:e.target.value})} placeholder="예: 서울 마포구"/></label><label>희망 일정<input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label></div>
        <label>상황 설명<textarea value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="공간 크기, 현재 상태, 꼭 보관할 물건 등을 간단히 적어주세요."/></label>
        <button className="primary" type="submit">{copied ? <><Check/> 요청서가 복사됐습니다</> : <>상담 요청서 복사 <ClipboardCheck/></>}</button>
        {copied && <small className="copy-help">이제 사용 중인 문자 또는 메신저 대화창에 붙여넣어 주세요. 대표 연락처가 확정되면 이 버튼을 바로 전송 방식으로 연결할 수 있습니다.</small>}
      </form>
    </motion.div>
  </motion.div>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>)
